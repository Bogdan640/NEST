import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ParkingState } from './parking.state';

export const selectParkingState = createFeatureSelector<ParkingState>('parking');

export const selectAnnouncements = createSelector(selectParkingState, (state) => state.announcements);
export const selectSlots = createSelector(selectParkingState, (state) => state.slots);
export const selectTotalCount = createSelector(selectParkingState, (state) => state.totalCount);
export const selectIsLoading = createSelector(selectParkingState, (state) => state.isLoading);
export const selectError = createSelector(selectParkingState, (state) => state.error);
