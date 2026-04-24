import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ParkingSelectors from './parking.selectors';
import { ParkingActions } from './parking.actions';
import { CreateAnnouncementRequest, CreateParkingSlotRequest } from '../../core/models/parking.model';
import { PaginationParams } from '../../core/models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class ParkingFacade {
  private store = inject(Store);

  announcements = this.store.selectSignal(ParkingSelectors.selectAnnouncements);
  slots = this.store.selectSignal(ParkingSelectors.selectSlots);
  totalCount = this.store.selectSignal(ParkingSelectors.selectTotalCount);
  isLoading = this.store.selectSignal(ParkingSelectors.selectIsLoading);
  error = this.store.selectSignal(ParkingSelectors.selectError);

  loadAnnouncements(params: PaginationParams): void {
    this.store.dispatch(ParkingActions.loadAnnouncements({ params }));
  }

  createAnnouncement(request: CreateAnnouncementRequest): void {
    this.store.dispatch(ParkingActions.createAnnouncement({ request }));
  }

  deleteAnnouncement(id: string): void {
    this.store.dispatch(ParkingActions.deleteAnnouncement({ id }));
  }

  applyToAnnouncement(id: string): void {
    this.store.dispatch(ParkingActions.applyToAnnouncement({ id }));
  }

  approveApplication(applicationId: string): void {
    this.store.dispatch(ParkingActions.approveApplication({ applicationId }));
  }

  loadSlots(): void {
    this.store.dispatch(ParkingActions.loadSlots());
  }

  createSlot(request: CreateParkingSlotRequest): void {
    this.store.dispatch(ParkingActions.createSlot({ request }));
  }
}
