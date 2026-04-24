import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ShedState } from './shed.state';

export const selectShedState = createFeatureSelector<ShedState>('shed');

export const selectResources = createSelector(selectShedState, (state) => state.resources);
export const selectTotalCount = createSelector(selectShedState, (state) => state.totalCount);
export const selectIsLoading = createSelector(selectShedState, (state) => state.isLoading);
export const selectError = createSelector(selectShedState, (state) => state.error);
