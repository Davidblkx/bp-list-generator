import { initKeyRead, readKey, readKeyRangeDigit } from './helpers/console';
import { importPostsToFile } from './menu/to-file';
import { importToFirestore } from './menu/to-firestore';
import { MenuOptions } from './models';

const baseUrl = 'https://www.brainpickings.org';

/** Startup funciton */
async function init() {

  console.clear();
  console.info('Welcome to BrainPickings scrapper\n');
  console.info('############### *** What to do? *** #################');
  console.info('###  1 - Import to file                           ###');
  console.info('###  2 - Import to database (Firestore)           ###');
  console.info('###  0 - Exit                                     ###');
  console.info('#####################################################');

  const option = <MenuOptions> (await readKeyRangeDigit(0, 2));

  switch (option) {
    case MenuOptions.importToFile:
      console.info('Reading posts from web...');
      await importPostsToFile(baseUrl);
      break;
    case MenuOptions.importToFirestore:
      await importToFirestore(baseUrl);
      break;
    case MenuOptions.exit:
      process.exit();
      break;
    default:
      console.info('Unkown Option, try again..');
      await readKey();
      init();
      break;
  }

}

initKeyRead();
init();
