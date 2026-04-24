import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EventsActions } from './events.actions';
import { EventsApiService } from '../../core/api/events-api.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import { AuthFacade } from '../auth/auth.facade';

@Injectable()
export class EventsEffects {
  private actions$ = inject(Actions);
  private eventsApi = inject(EventsApiService);
  private authFacade = inject(AuthFacade);

  loadEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.loadEvents),
      mergeMap(({ params }) =>
        this.eventsApi.getEvents(params).pipe(
          map((response) => EventsActions.loadEventsSuccess({ response })),
          catchError((error) =>
            of(EventsActions.loadEventsFailure({ error: error.error?.message || 'Failed to load events' }))
          )
        )
      )
    )
  );

  createEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.createEvent),
      mergeMap(({ request }) =>
        this.eventsApi.createEvent(request).pipe(
          map((event) => EventsActions.createEventSuccess({ event })),
          catchError((error) =>
            of(EventsActions.createEventFailure({ error: error.error?.message || 'Failed to create event' }))
          )
        )
      )
    )
  );

  updateEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.updateEvent),
      mergeMap(({ id, request }) =>
        this.eventsApi.updateEvent(id, request).pipe(
          map((event) => EventsActions.updateEventSuccess({ event })),
          catchError((error) =>
            of(EventsActions.updateEventFailure({ error: error.error?.message || 'Failed to update event' }))
          )
        )
      )
    )
  );

  deleteEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.deleteEvent),
      mergeMap(({ id }) =>
        this.eventsApi.deleteEvent(id).pipe(
          map(() => EventsActions.deleteEventSuccess({ id })),
          catchError((error) =>
            of(EventsActions.deleteEventFailure({ error: error.error?.message || 'Failed to delete event' }))
          )
        )
      )
    )
  );

  joinEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.joinEvent),
      mergeMap(({ id }) =>
        this.eventsApi.joinEvent(id).pipe(
          map(() => {
            const currentUser = this.authFacade.currentUser();
            const userId = currentUser ? currentUser.id : '';
            return EventsActions.joinEventSuccess({ id, userId });
          }),
          catchError((error) =>
            of(EventsActions.joinEventFailure({ error: error.error?.message || 'Failed to join event' }))
          )
        )
      )
    )
  );

  leaveEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.leaveEvent),
      mergeMap(({ id }) =>
        this.eventsApi.leaveEvent(id).pipe(
          map(() => {
            const currentUser = this.authFacade.currentUser();
            const userId = currentUser ? currentUser.id : '';
            return EventsActions.leaveEventSuccess({ id, userId });
          }),
          catchError((error) =>
            of(EventsActions.leaveEventFailure({ error: error.error?.message || 'Failed to leave event' }))
          )
        )
      )
    )
  );
}
