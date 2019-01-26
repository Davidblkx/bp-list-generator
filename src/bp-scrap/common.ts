import { getHtmlDocument, none } from '../helpers';
import { Post } from '../models';
import { loadBrainPickingsPost } from './load-post';

// ******* Selectors *********
const $postEntry: string = '.post';
// ******* end Selectors *********

export async function loadBrainPickingsPage(
  page: number,
  baseUrl: string,
  _error?: (message: string) => void
) {
  const url = `${baseUrl}/page/${page}`;

  try {
    return await getHtmlDocument(url);
  } catch {
    if (_error) { _error('error loading page: ' + url); }
    return none<CheerioStatic>();
  }
}

export function loadPagePosts($: CheerioStatic) {
  return $($postEntry).toArray().map(e => loadBrainPickingsPost(e));
}

export async function loadBrainPickingsPagePosts(page: number, baseUrl: string): Promise<Post[]> {
  return (await loadBrainPickingsPage(page, baseUrl))
    .some(loadPagePosts)
    .match(e => e, () => [])
    .toPromise();
}
