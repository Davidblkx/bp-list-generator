import { writeFile } from 'fs';
import { loadBrainPickingsPosts } from './bp-scrap';
import { tryExec } from './helpers';
import { ProgressStatus } from './models';

const baseUrl = 'https://www.brainpickings.org';

/** Startup funciton */
async function init() {
  console.info('starting..');
  try {
    const posts = await loadBrainPickingsPosts(baseUrl, onProgress);
    console.info('loading posts ended..\nsaving to file..');
    writeFile('./post-list.json', JSON.stringify(posts), () => console.info('write complete!'));
  } catch (error) {
    console.error('error completing', error);
  }
}

function onProgress(s: ProgressStatus, message?: string) {
  const date = new Date().toISOString().slice(0, 16);
  const pages = `Pages[${s.pages.current}/${s.pages.total}]`;
  const posts = `Post[${s.donePagePosts}/${s.totalPagePosts} (${s.donePosts})]`;
  const msg = message || tryExec(() => {
    if (s.lastPost) { return s.lastPost.title; }
    return '';
  }, '');

  console.info(`${date}|${pages}|${posts}: ${msg}`);
}

init();
