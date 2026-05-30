import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ParkingState } from './parking.state';

export const selectParkingState = createFeatureSelector<ParkingState>('parking');

export const selectParkingAnnouncements = createSelector(selectParkingState, (state) => state.announcements);
export const selectParkingSlots = createSelector(selectParkingState, (state) => state.slots);
export const selectParkingTotalCount = createSelector(selectParkingState, (state) => state.totalCount);
export const selectParkingIsLoading = createSelector(selectParkingState, (state) => state.isLoading);
export const selectParkingError = createSelector(selectParkingState, (state) => state.error);
