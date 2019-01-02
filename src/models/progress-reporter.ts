import { Pagination } from './pagination';
import { Post } from './post';

export type ProgressReporter = (status: ProgressStatus, message?: string) => void;

export interface ProgressStatus {
  pages: Pagination;
  totalPagePosts: number;
  donePagePosts: number;
  donePosts: number;
  lastPost?: Post;
  stopProcess: () => void;
}
