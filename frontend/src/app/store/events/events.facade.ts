import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as EventsSelectors from './events.selectors';
import { EventsActions } from './events.actions';
import { CreateEventRequest, UpdateEventRequest } from '../../core/models/event.model';
import { PaginationParams } from '../../core/models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class EventsFacade {
  private store = inject(Store);

  events = this.store.selectSignal(EventsSelectors.selectEvents);
  totalCount = this.store.selectSignal(EventsSelectors.selectTotalCount);
  isLoading = this.store.selectSignal(EventsSelectors.selectIsLoading);
  error = this.store.selectSignal(EventsSelectors.selectError);

  loadEvents(params: PaginationParams): void {
    this.store.dispatch(EventsActions.loadEvents({ params }));
  }

  createEvent(request: CreateEventRequest): void {
    this.store.dispatch(EventsActions.createEvent({ request }));
  }

  updateEvent(id: string, request: UpdateEventRequest): void {
    this.store.dispatch(EventsActions.updateEvent({ id, request }));
  }

  deleteEvent(id: string): void {
    this.store.dispatch(EventsActions.deleteEvent({ id }));
  }

  joinEvent(id: string): void {
    this.store.dispatch(EventsActions.joinEvent({ id }));
  }

  leaveEvent(id: string): void {
    this.store.dispatch(EventsActions.leaveEvent({ id }));
  }
}
