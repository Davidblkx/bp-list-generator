// ================================================================================================
// functions to load Brain Pickings Posts by page
// ================================================================================================
import { getHtmlDocument, none, Option, some } from '../helpers';
import { DbStatus, Pagination, Post, ProgressReporter, ProgressStatus } from '../models';
import { loadBrainPickingsPage, loadBrainPickingsPagePosts } from './common';
import { loadTotalPages } from './load-page-list';
import { loadBrainPickingsPost } from './load-post';

export async function loadBrainPickingsPostsProgressive(
  baseUrl: string,
  status: DbStatus,
  onNext: (pageInfo: Pagination, posts: Post[]) => Promise<void>,
  onComplete: (totalPages: number, loaded: number) => void | Promise<void>
) {
  console.info('Loading page count..');
  (await loadBrainPickingsPage(1, baseUrl))
      .some(e => loadTotalPages(e))
      .some(e => loadAllRemaingPages(baseUrl, status, e, onNext, onComplete));
}

async function loadAllRemaingPages(
  baseUrl: string,
  dbStatus: DbStatus,
  pages: Pagination,
  onNext: (pageInfo: Pagination, posts: Post[]) => Promise<void>,
  onComplete: (totalPages: number, loaded: number) => void
) {
  const rPages = pages.total - dbStatus.totalFetch;
  let loadCount = 0;

  for (let i = rPages; i > 0; i--) {
    console.info('Loading page ' + i);
    try {
      const posts = await loadBrainPickingsPagePosts(i, baseUrl);
      await onNext({
        current: i,
        total: pages.total
      }, posts);
      loadCount++;
    } catch (err) {
      console.error('Error loading page: ' + i, err);
    }
  }

  onComplete(pages.total, loadCount);
}
