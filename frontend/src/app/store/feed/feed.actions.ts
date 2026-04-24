import { createActionGroup, props } from '@ngrx/store';
import { Post, CreatePostRequest, UpdatePostRequest } from '../../core/models/post.model';
import { PaginatedResponse, PaginationParams } from '../../core/models/paginated-response.model';

export const FeedActions = createActionGroup({
  source: 'Feed',
  events: {
    'Load Posts': props<{ params: PaginationParams }>(),
    'Load Posts Success': props<{ response: PaginatedResponse<Post> }>(),
    'Load Posts Failure': props<{ error: string }>(),

    'Create Post': props<{ request: CreatePostRequest }>(),
    'Create Post Success': props<{ post: Post }>(),
    'Create Post Failure': props<{ error: string }>(),

    'Update Post': props<{ id: string; request: UpdatePostRequest }>(),
    'Update Post Success': props<{ post: Post }>(),
    'Update Post Failure': props<{ error: string }>(),

    'Delete Post': props<{ id: string }>(),
    'Delete Post Success': props<{ id: string }>(),
    'Delete Post Failure': props<{ error: string }>(),
  },
});
