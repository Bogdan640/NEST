import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { EventsFacade } from '../../store/events/events.facade';

export const eventsResolver: ResolveFn<boolean> = () => {
  const facade = inject(EventsFacade);
  facade.loadEvents({ page: 1, limit: 20 });
  return true;
};
