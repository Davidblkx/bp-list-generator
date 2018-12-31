import { getHtmlDocument } from './helpers';

const baseUrl = 'https://www.brainpickings.org';

/** Startup funciton */
async function init() {
  console.info('starting..');

  const maybe = await getHtmlDocument(`${baseUrl}/page/1`);
  maybe.none(error).some(countPosts);
}

function countPosts(html: CheerioStatic) {
  const total = html('.post').toArray().reduce((n) => n + 1, 0);
  console.info('total: ', total);
}

function error() {
  console.error("can't scrap page");
}

init();
