import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ParkingActions } from './parking.actions';
import { ParkingApiService } from '../../core/api/parking-api.service';
import { catchError, map, switchMap, mergeMap, of } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { DEFAULT_PARKING_PAGE_SIZE, FIRST_PAGE } from '../../core/constants/ui';

@Injectable()
export class ParkingEffects {
  private actions$ = inject(Actions);
  private parkingApi = inject(ParkingApiService);
  private toastService = inject(ToastService);

  loadAnnouncements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParkingActions.loadAnnouncements),
      switchMap(({ params }) =>
        this.parkingApi.getAnnouncements(params).pipe(
          map((response) => ParkingActions.loadAnnouncementsSuccess({ response })),
          catchError((error) => {
            const msg = error.error?.message || 'Failed to load announcements';
            this.toastService.show(msg, 'error');
            return of(ParkingActions.loadAnnouncementsFailure({ error: msg }));
          })
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
          catchError((error) => {
            const msg = error.error?.message || 'Failed to create announcement';
            this.toastService.show(msg, 'error');
            return of(ParkingActions.createAnnouncementFailure({ error: msg }));
          })
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
          catchError((error) => {
            const msg = error.error?.message || 'Failed to delete announcement';
            this.toastService.show(msg, 'error');
            return of(ParkingActions.deleteAnnouncementFailure({ error: msg }));
          })
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
          catchError((error) => {
            const msg = error.error?.message || 'Failed to apply';
            this.toastService.show(msg, 'error');
            return of(ParkingActions.applyToAnnouncementFailure({ error: msg }));
          })
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
          catchError((error) => {
            const msg = error.error?.message || 'Failed to approve application';
            this.toastService.show(msg, 'error');
            return of(ParkingActions.approveApplicationFailure({ error: msg }));
          })
        )
      )
    )
  );

  loadSlots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParkingActions.loadSlots),
      switchMap(() =>
        this.parkingApi.getSlots().pipe(
          map((slots) => ParkingActions.loadSlotsSuccess({ slots })),
          catchError((error) => {
            const msg = error.error?.message || 'Failed to load slots';
            this.toastService.show(msg, 'error');
            return of(ParkingActions.loadSlotsFailure({ error: msg }));
          })
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
          catchError((error) => {
            const msg = error.error?.message || 'Failed to create slot';
            this.toastService.show(msg, 'error');
            return of(ParkingActions.createSlotFailure({ error: msg }));
          })
        )
      )
    )
  );

  refreshAnnouncements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ParkingActions.applyToAnnouncementSuccess,
        ParkingActions.approveApplicationSuccess
      ),
      map(() => ParkingActions.loadAnnouncements({ params: { page: FIRST_PAGE, limit: DEFAULT_PARKING_PAGE_SIZE } }))
    )
  );
}
