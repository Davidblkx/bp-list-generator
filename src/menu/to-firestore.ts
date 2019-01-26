import { ServiceAccount } from 'firebase-admin';

import { loadBrainPickingsPostsProgressive } from '../bp-scrap';
import { BPDatabase, initBPDatabaseInstance } from '../firestore';
import { loadJsonFile, question } from '../helpers';

export async function importToFirestore(baseUrl: string) {
  const pathToKey = await question('Path to firestore key file:');
  const key = await loadJsonFile<ServiceAccount>(pathToKey);
  console.info('loading database...');
  key
    .some(e => initBPDatabaseInstance(e))
    .match(
      e => importPostsToFirestore(baseUrl, e),
      () => console.error('Error loading firestore key file')
    );
}

async function importPostsToFirestore(baseUrl: string, db: BPDatabase) {
  const status = await db.getStatus();
  loadBrainPickingsPostsProgressive(
    baseUrl,
    status,
    async (info, list) => {
      console.info('Load finished for page ' + info.current);
      console.info('saving posts for page ' + info.current);
      await db.savePosts(list);
      console.info('completed saving posts for page ' + info.current);
      await db.updateStatus({
        totalFetch: info.total - info.current,
        totalPages: info.total
      });
    },
    (total, loaded) => {
      console.info(`Load completed! ${loaded} pages loaded from ${total}`);
      db.updateStatus({
        totalFetch: total,
        totalPages: total
      });
    }
  );
}
