import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ShedActions } from './shed.actions';
import { ShedApiService } from '../../core/api/shed-api.service';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class ShedEffects {
  private actions$ = inject(Actions);
  private shedApi = inject(ShedApiService);

  loadResources$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShedActions.loadResources),
      mergeMap(({ params }) =>
        this.shedApi.getResources(params).pipe(
          map((response) => ShedActions.loadResourcesSuccess({ response })),
          catchError((error) =>
            of(ShedActions.loadResourcesFailure({ error: error.error?.message || 'Failed to load resources' }))
          )
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
          catchError((error) =>
            of(ShedActions.createResourceFailure({ error: error.error?.message || 'Failed to create resource' }))
          )
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
          catchError((error) =>
            of(ShedActions.updateResourceFailure({ error: error.error?.message || 'Failed to update resource' }))
          )
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
          catchError((error) =>
            of(ShedActions.deleteResourceFailure({ error: error.error?.message || 'Failed to delete resource' }))
          )
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
          catchError((error) =>
            of(ShedActions.reserveResourceFailure({ error: error.error?.message || 'Failed to reserve resource' }))
          )
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
          catchError((error) =>
            of(ShedActions.returnResourceFailure({ error: error.error?.message || 'Failed to return resource' }))
          )
        )
      )
    )
  );
}
