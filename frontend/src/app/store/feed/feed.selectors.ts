import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeedState } from './feed.state';

export const selectFeedState = createFeatureSelector<FeedState>('feed');

export const selectFeedPosts = createSelector(selectFeedState, (state) => state.posts);
export const selectFeedTotalCount = createSelector(selectFeedState, (state) => state.totalCount);
export const selectFeedIsLoading = createSelector(selectFeedState, (state) => state.isLoading);
export const selectFeedError = createSelector(selectFeedState, (state) => state.error);
