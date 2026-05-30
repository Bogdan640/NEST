import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ShedState } from './shed.state';

export const selectShedState = createFeatureSelector<ShedState>('shed');

export const selectShedResources = createSelector(selectShedState, (state) => state.resources);
export const selectShedTotalCount = createSelector(selectShedState, (state) => state.totalCount);
export const selectShedIsLoading = createSelector(selectShedState, (state) => state.isLoading);
export const selectShedError = createSelector(selectShedState, (state) => state.error);
