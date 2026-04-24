import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ShedSelectors from './shed.selectors';
import { ShedActions } from './shed.actions';
import { CreateResourceRequest, UpdateResourceRequest, ReserveResourceRequest } from '../../core/models/resource.model';
import { PaginationParams } from '../../core/models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class ShedFacade {
  private store = inject(Store);

  resources = this.store.selectSignal(ShedSelectors.selectResources);
  totalCount = this.store.selectSignal(ShedSelectors.selectTotalCount);
  isLoading = this.store.selectSignal(ShedSelectors.selectIsLoading);
  error = this.store.selectSignal(ShedSelectors.selectError);

  loadResources(params: PaginationParams): void {
    this.store.dispatch(ShedActions.loadResources({ params }));
  }

  createResource(request: CreateResourceRequest): void {
    this.store.dispatch(ShedActions.createResource({ request }));
  }

  updateResource(id: string, request: UpdateResourceRequest): void {
    this.store.dispatch(ShedActions.updateResource({ id, request }));
  }

  deleteResource(id: string): void {
    this.store.dispatch(ShedActions.deleteResource({ id }));
  }

  reserveResource(id: string, request: ReserveResourceRequest): void {
    this.store.dispatch(ShedActions.reserveResource({ id, request }));
  }

  returnResource(id: string): void {
    this.store.dispatch(ShedActions.returnResource({ id }));
  }
}
