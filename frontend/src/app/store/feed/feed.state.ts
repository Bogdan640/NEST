import { Post } from '../../core/models/post.model';

export interface FeedState {
  posts: Post[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
}

export const initialFeedState: FeedState = {
  posts: [],
  totalCount: 0,
  isLoading: false,
  error: null,
};
