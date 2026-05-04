import { feedReducer } from './feed.reducer';
import { initialFeedState } from './feed.state';
import { FeedActions } from './feed.actions';
import { Post } from '../../core/models/post.model';

describe('FeedReducer', () => {
  it('should return the initial state', () => {
    const action = { type: 'Unknown' };
    const state = feedReducer(initialFeedState, action);

    expect(state).toBe(initialFeedState);
  });

  it('should set isLoading to true on loadPosts', () => {
    const action = FeedActions.loadPosts({ params: { page: 1, limit: 10 } });
    const state = feedReducer(initialFeedState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should update state with posts on loadPostsSuccess', () => {
    const mockPosts: any = [
      { id: '1', content: 'Test post' }
    ];
    
    const response = { data: mockPosts, total: 1, page: 1, limit: 10, totalPages: 1 };
    const action = FeedActions.loadPostsSuccess({ response });
    const state = feedReducer(initialFeedState, action);

    expect(state.isLoading).toBe(false);
    expect(state.posts).toEqual(mockPosts);
    expect(state.totalCount).toBe(1);
  });
});
