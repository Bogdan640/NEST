import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ShedActions } from './shed.actions';
import { ShedApiService } from '../../core/api/shed-api.service';
import { catchError, map, switchMap, mergeMap, of } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { DEFAULT_SHED_PAGE_SIZE, FIRST_PAGE } from '../../core/constants/ui';

@Injectable()
export class ShedEffects {
  private actions$ = inject(Actions);
  private shedApi = inject(ShedApiService);
  private toastService = inject(ToastService);

  loadResources$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShedActions.loadResources),
      switchMap(({ params }) =>
        this.shedApi.getResources(params).pipe(
          map((response) => ShedActions.loadResourcesSuccess({ response })),
          catchError((error) => {
            const msg = error.error?.message || 'Failed to load resources';
            this.toastService.show(msg, 'error');
            return of(ShedActions.loadResourcesFailure({ error: msg }));
          })
        )
      )
    )
  );

  createResource$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShedActions.createResource),
      mergeMap(({ request }) =>
        this.shedApi.createResource(request).pipe(
          map((resource) => ShedActions.createResourceSuccess({ resource })),
          catchError((error) => {
            const msg = error.error?.message || 'Failed to create resource';
            this.toastService.show(msg, 'error');
            return of(ShedActions.createResourceFailure({ error: msg }));
          })
        )
      )
    )
  );

  updateResource$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShedActions.updateResource),
      mergeMap(({ id, request }) =>
        this.shedApi.updateResource(id, request).pipe(
          map((resource) => ShedActions.updateResourceSuccess({ resource })),
          catchError((error) => {
            const msg = error.error?.message || 'Failed to update resource';
            this.toastService.show(msg, 'error');
            return of(ShedActions.updateResourceFailure({ error: msg }));
          })
        )
      )
    )
  );

  deleteResource$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShedActions.deleteResource),
      mergeMap(({ id }) =>
        this.shedApi.deleteResource(id).pipe(
          map(() => ShedActions.deleteResourceSuccess({ id })),
          catchError((error) => {
            const msg = error.error?.message || 'Failed to delete resource';
            this.toastService.show(msg, 'error');
            return of(ShedActions.deleteResourceFailure({ error: msg }));
          })
        )
      )
    )
  );

  reserveResource$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShedActions.reserveResource),
      mergeMap(({ id, request }) =>
        this.shedApi.reserveResource(id, request).pipe(
          map(() => ShedActions.reserveResourceSuccess({ id })),
          catchError((error) => {
            const msg = error.error?.message || 'Failed to reserve resource';
            this.toastService.show(msg, 'error');
            return of(ShedActions.reserveResourceFailure({ error: msg }));
          })
        )
      )
    )
  );

  returnResource$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShedActions.returnResource),
      mergeMap(({ id }) =>
        this.shedApi.returnResource(id).pipe(
          map(() => ShedActions.returnResourceSuccess({ id })),
          catchError((error) => {
            const msg = error.error?.message || 'Failed to return resource';
            this.toastService.show(msg, 'error');
            return of(ShedActions.returnResourceFailure({ error: msg }));
          })
        )
      )
    )
  );

  reloadOnChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ShedActions.reserveResourceSuccess, 
        ShedActions.returnResourceSuccess,
        ShedActions.reserveResourceFailure // Reload if they try to borrow an already borrowed item
      ),
      map(() => ShedActions.loadResources({ params: { page: FIRST_PAGE, limit: DEFAULT_SHED_PAGE_SIZE } }))
    )
  );
}
