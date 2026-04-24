import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FeedFacade } from '../../store/feed/feed.facade';

export const feedResolver: ResolveFn<boolean> = () => {
  const facade = inject(FeedFacade);
  facade.loadPosts({ page: 1, limit: 10 });
  return true;
};
