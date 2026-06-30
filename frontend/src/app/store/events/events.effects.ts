import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EventsActions } from './events.actions';
import { EventsApiService } from '../../core/api/events-api.service';
import { catchError, map, switchMap, mergeMap, of } from 'rxjs';
import { AuthFacade } from '../auth/auth.facade';
import { ToastService } from '../../shared/services/toast.service';

@Injectable()
export class EventsEffects {
  private actions$ = inject(Actions);
  private eventsApi = inject(EventsApiService);
  private authFacade = inject(AuthFacade);
  private toastService = inject(ToastService);

  loadEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.loadEvents),
      switchMap(({ params }) =>
        this.eventsApi.getEvents(params).pipe(
          map((response) => EventsActions.loadEventsSuccess({ response })),
          catchError((error) => {
            const msg = error.error?.message || 'Failed to load events';
            this.toastService.show(msg, 'error');
            return of(EventsActions.loadEventsFailure({ error: msg }));
          })
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
          catchError((error) => {
            const msg = error.error?.message || 'Failed to create event';
            this.toastService.show(msg, 'error');
            return of(EventsActions.createEventFailure({ error: msg }));
          })
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
          catchError((error) => {
            const msg = error.error?.message || 'Failed to update event';
            this.toastService.show(msg, 'error');
            return of(EventsActions.updateEventFailure({ error: msg }));
          })
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
          catchError((error) => {
            const msg = error.error?.message || 'Failed to delete event';
            this.toastService.show(msg, 'error');
            return of(EventsActions.deleteEventFailure({ error: msg }));
          })
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
          catchError((error) => {
            const msg = error.error?.message || 'Failed to join event';
            this.toastService.show(msg, 'error');
            return of(EventsActions.joinEventFailure({ error: msg }));
          })
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
          catchError((error) => {
            const msg = error.error?.message || 'Failed to leave event';
            this.toastService.show(msg, 'error');
            return of(EventsActions.leaveEventFailure({ error: msg }));
          })
        )
      )
    )
  );

  reloadOnChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        EventsActions.createEventSuccess,
        EventsActions.deleteEventSuccess
      ),
      map(() => EventsActions.loadEvents({ params: { page: 1, limit: 20 } }))
    )
  );
}
