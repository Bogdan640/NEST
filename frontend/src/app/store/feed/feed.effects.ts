import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FeedActions } from './feed.actions';
import { FeedApiService } from '../../core/api/feed-api.service';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class FeedEffects {
  private actions$ = inject(Actions);
  private feedApi = inject(FeedApiService);

  loadPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeedActions.loadPosts),
      mergeMap(({ params }) =>
        this.feedApi.getPosts(params).pipe(
          map((response) => FeedActions.loadPostsSuccess({ response })),
          catchError((error) =>
            of(FeedActions.loadPostsFailure({ error: error.error?.message || 'Failed to load posts' }))
          )
        )
      )
    )
  );

  createPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeedActions.createPost),
      mergeMap(({ request }) =>
        this.feedApi.createPost(request).pipe(
          map((post) => FeedActions.createPostSuccess({ post })),
          catchError((error) =>
            of(FeedActions.createPostFailure({ error: error.error?.message || 'Failed to create post' }))
          )
        )
      )
    )
  );

  updatePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeedActions.updatePost),
      mergeMap(({ id, request }) =>
        this.feedApi.updatePost(id, request).pipe(
          map((post) => FeedActions.updatePostSuccess({ post })),
          catchError((error) =>
            of(FeedActions.updatePostFailure({ error: error.error?.message || 'Failed to update post' }))
          )
        )
      )
    )
  );

  deletePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeedActions.deletePost),
      mergeMap(({ id }) =>
        this.feedApi.deletePost(id).pipe(
          map(() => FeedActions.deletePostSuccess({ id })),
          catchError((error) =>
            of(FeedActions.deletePostFailure({ error: error.error?.message || 'Failed to delete post' }))
          )
        )
      )
    )
  );
}
