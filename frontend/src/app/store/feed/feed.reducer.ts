import { createReducer, on } from '@ngrx/store';
import { initialFeedState } from './feed.state';
import { FeedActions } from './feed.actions';

export const feedReducer = createReducer(
  initialFeedState,
  on(FeedActions.loadPosts, (state) => ({ ...state, isLoading: true, error: null })),
  on(FeedActions.loadPostsSuccess, (state, { response }) => ({
    ...state,
    isLoading: false,
    posts: response.data,
    totalCount: response.total,
  })),
  on(FeedActions.loadPostsFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(FeedActions.createPost, (state) => ({ ...state, isLoading: true, error: null })),
  on(FeedActions.createPostSuccess, (state, { post }) => ({
    ...state,
    isLoading: false,
    posts: [post, ...state.posts],
    totalCount: state.totalCount + 1,
  })),
  on(FeedActions.createPostFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(FeedActions.updatePost, (state) => ({ ...state, isLoading: true, error: null })),
  on(FeedActions.updatePostSuccess, (state, { post }) => ({
    ...state,
    isLoading: false,
    posts: state.posts.map((p) => (p.id === post.id ? post : p)),
  })),
  on(FeedActions.updatePostFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(FeedActions.deletePost, (state) => ({ ...state, isLoading: true, error: null })),
  on(FeedActions.deletePostSuccess, (state, { id }) => ({
    ...state,
    isLoading: false,
    posts: state.posts.filter((p) => p.id !== id),
    totalCount: state.totalCount - 1,
  })),
  on(FeedActions.deletePostFailure, (state, { error }) => ({ ...state, isLoading: false, error }))
);
