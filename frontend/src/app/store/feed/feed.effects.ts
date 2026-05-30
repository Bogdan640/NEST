import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FeedActions } from './feed.actions';
import { FeedApiService } from '../../core/api/feed-api.service';
import { catchError, map, switchMap, mergeMap, of } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

@Injectable()
export class FeedEffects {
  private actions$ = inject(Actions);
  private feedApi = inject(FeedApiService);
  private toastService = inject(ToastService);

  loadPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeedActions.loadPosts),
      switchMap(({ params }) =>
        this.feedApi.getPosts(params).pipe(
          map((response) => FeedActions.loadPostsSuccess({ response })),
          catchError((error) => {
            const msg = error.error?.message || 'Failed to load posts';
            this.toastService.show(msg, 'error');
            return of(FeedActions.loadPostsFailure({ error: msg }));
          })
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
          catchError((error) => {
            const msg = error.error?.message || 'Failed to create post';
            this.toastService.show(msg, 'error');
            return of(FeedActions.createPostFailure({ error: msg }));
          })
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
          catchError((error) => {
            const msg = error.error?.message || 'Failed to update post';
            this.toastService.show(msg, 'error');
            return of(FeedActions.updatePostFailure({ error: msg }));
          })
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
          catchError((error) => {
            const msg = error.error?.message || 'Failed to delete post';
            this.toastService.show(msg, 'error');
            return of(FeedActions.deletePostFailure({ error: msg }));
          })
        )
      )
    )
  );
}
