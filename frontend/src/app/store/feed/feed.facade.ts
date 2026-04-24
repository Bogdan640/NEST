import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as FeedSelectors from './feed.selectors';
import { FeedActions } from './feed.actions';
import { CreatePostRequest, UpdatePostRequest } from '../../core/models/post.model';
import { PaginationParams } from '../../core/models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class FeedFacade {
  private store = inject(Store);

  posts = this.store.selectSignal(FeedSelectors.selectPosts);
  totalCount = this.store.selectSignal(FeedSelectors.selectTotalCount);
  isLoading = this.store.selectSignal(FeedSelectors.selectIsLoading);
  error = this.store.selectSignal(FeedSelectors.selectError);

  loadPosts(params: PaginationParams): void {
    this.store.dispatch(FeedActions.loadPosts({ params }));
  }

  createPost(request: CreatePostRequest): void {
    this.store.dispatch(FeedActions.createPost({ request }));
  }

  updatePost(id: string, request: UpdatePostRequest): void {
    this.store.dispatch(FeedActions.updatePost({ id, request }));
  }

  deletePost(id: string): void {
    this.store.dispatch(FeedActions.deletePost({ id }));
  }
}
