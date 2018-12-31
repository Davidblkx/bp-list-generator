// ================================================================================================
// functions to load Brain Pickings Posts from a CheerioStatic
// ================================================================================================
import { genericValidator } from './helpers';
import { Post, ProgressReporter } from './models';

// ******* Selectors *********
const $postId: string = '#posts';
const $postEntry: string = '.post';
const $postGroup: string = '.post_content';
const $title: string = '.entry-title>a';
const $by: string = '.byline';
const $subtitle: string = '.post>h2';
// ******* end Selectors *********

let _reporter: ProgressReporter | undefined;
let _total: number = 0;
let _done: number = 0;
let _postList: Post[] = [];

export function LoadBrainPickingsPosts($: CheerioStatic, reporter?: ProgressReporter) {
  reset();
  _reporter = reporter;
}

function reportProgress(post: Post) {
  _postList.push(post);
  _done++;

  if (_reporter && typeof _reporter === 'function') {
    _reporter(_total, _done);
  }
}

function reset() {
  _reporter = undefined;
  _total = 0;
  _done = 0;
  _postList = [];
}
