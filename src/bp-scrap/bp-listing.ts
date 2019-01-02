// ================================================================================================
// functions to load Brain Pickings Posts from a CheerioStatic
// ================================================================================================
import { getHtmlDocument, none, Option, some } from '../helpers';
import { Pagination, Post, ProgressReporter, ProgressStatus } from '../models';
import { loadTotalPages } from './load-page-list';
import { loadBrainPickingsPost } from './load-post';

// ******* Selectors *********
const $postEntry: string = '.post';
// ******* end Selectors *********

let _reporter: ProgressReporter | undefined;
let _baseUrl: string;
let _stop: boolean = false;
let _status: ProgressStatus;
let _postList: Post[] = [];
let _success: (data: Post[]) => void;
let _error: (e: unknown) => void;

export function loadBrainPickingsPosts(
  baseUrl: string,
  reporter?: ProgressReporter
): Promise<Post[]> {
  reset(baseUrl, reporter);

  return new Promise((res, rej) => {
    _success = res;
    _error = rej;

    loadBrainPickingsPage(1)
      .then(
        result => {
          result
            .some(e => loadTotalPages(e))
            .some(e => loadAllPosts(e))
            .none(() => _error('Error loading pages'));
        },
        err => _error(err)
      );
  });
}

async function loadAllPosts(pages: Pagination) {
  try {
    _status.pages = pages;

    while (_status.pages.current <= _status.pages.total && !_stop) {
      reportProgress(`Page ${_status.pages.current} started`);

      const page = await loadCurrentPage();
      page
        .some(e => loadPagePosts(e))
        .none(() => {
          _error('cannot load page ' + _status.pages.current);
          _stop = true;
        });

      reportProgress(`Page ${_status.pages.current} completed`);
      _status.pages.current++;
    }

    _success(_postList);

  } catch (err) {
    _error(err);
  }
}

function loadPagePosts($: CheerioStatic) {
  const rawPosts = $($postEntry);
  _status.donePagePosts = 0;
  _status.totalPagePosts = rawPosts.length;
  reportProgress(`Found ${rawPosts.length} posts on current page`);

  for (let i = 0; i < rawPosts.length; i++) {
    const data = rawPosts[i];
    const post = loadBrainPickingsPost(data);
    _status.donePagePosts++;
    _status.donePosts++;
    reportProgress(undefined, post);
  }

  return true;
}

const loadCurrentPage = () => loadBrainPickingsPage(_status.pages.current);
async function loadBrainPickingsPage(page: number) {
  const url = `${_baseUrl}/page/${page}`;

  try {
    return await getHtmlDocument(url);
  } catch {
    _error('error loading page: ' + url);
    return none<CheerioStatic>();
  }
}

function reportProgress(message?: string, post?: Post) {
  if (post) {
    _postList.push(post);
    _status.lastPost = post;
  }

  if (_reporter && typeof _reporter === 'function') {
    _reporter(_status, message);
  }
}

function initStatus(): ProgressStatus {
  return {
    donePosts: 0,
    totalPagePosts: 0,
    donePagePosts: 0,
    pages: {
      current: 0,
      total: 0
    },
    stopProcess: () => {
      _stop = false;
      console.warn('Stop process was called..');
    }
  };
}

function reset(baseUrl: string, reporter?: ProgressReporter) {
  _reporter = reporter;
  _baseUrl = baseUrl;
  _status = initStatus();
  _postList = [];
}
