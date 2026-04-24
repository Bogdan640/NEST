import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ParkingActions } from './parking.actions';
import { ParkingApiService } from '../../core/api/parking-api.service';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class ParkingEffects {
  private actions$ = inject(Actions);
  private parkingApi = inject(ParkingApiService);

  loadAnnouncements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParkingActions.loadAnnouncements),
      mergeMap(({ params }) =>
        this.parkingApi.getAnnouncements(params).pipe(
          map((response) => ParkingActions.loadAnnouncementsSuccess({ response })),
          catchError((error) =>
            of(ParkingActions.loadAnnouncementsFailure({ error: error.error?.message || 'Failed to load announcements' }))
          )
        )
      )
    )
  );

  createAnnouncement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParkingActions.createAnnouncement),
      mergeMap(({ request }) =>
        this.parkingApi.createAnnouncement(request).pipe(
          map((announcement) => ParkingActions.createAnnouncementSuccess({ announcement })),
          catchError((error) =>
            of(ParkingActions.createAnnouncementFailure({ error: error.error?.message || 'Failed to create announcement' }))
          )
        )
      )
    )
  );

  deleteAnnouncement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParkingActions.deleteAnnouncement),
      mergeMap(({ id }) =>
        this.parkingApi.deleteAnnouncement(id).pipe(
          map(() => ParkingActions.deleteAnnouncementSuccess({ id })),
          catchError((error) =>
            of(ParkingActions.deleteAnnouncementFailure({ error: error.error?.message || 'Failed to delete announcement' }))
          )
        )
      )
    )
  );

  applyToAnnouncement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParkingActions.applyToAnnouncement),
      mergeMap(({ id }) =>
        this.parkingApi.applyToAnnouncement(id).pipe(
          map(() => ParkingActions.applyToAnnouncementSuccess({ id })),
          catchError((error) =>
            of(ParkingActions.applyToAnnouncementFailure({ error: error.error?.message || 'Failed to apply' }))
          )
        )
      )
    )
  );

  approveApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParkingActions.approveApplication),
      mergeMap(({ applicationId }) =>
        this.parkingApi.approveApplication(applicationId).pipe(
          map(() => ParkingActions.approveApplicationSuccess({ applicationId })),
          catchError((error) =>
            of(ParkingActions.approveApplicationFailure({ error: error.error?.message || 'Failed to approve application' }))
          )
        )
      )
    )
  );

  loadSlots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParkingActions.loadSlots),
      mergeMap(() =>
        this.parkingApi.getSlots().pipe(
          map((slots) => ParkingActions.loadSlotsSuccess({ slots })),
          catchError((error) =>
            of(ParkingActions.loadSlotsFailure({ error: error.error?.message || 'Failed to load slots' }))
          )
        )
      )
    )
  );

  createSlot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParkingActions.createSlot),
      mergeMap(({ request }) =>
        this.parkingApi.createSlot(request).pipe(
          map((slot) => ParkingActions.createSlotSuccess({ slot })),
          catchError((error) =>
            of(ParkingActions.createSlotFailure({ error: error.error?.message || 'Failed to create slot' }))
          )
        )
      )
    )
  );
}
