import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EventsState } from './events.state';

export const selectEventsState = createFeatureSelector<EventsState>('events');

export const selectEvents = createSelector(selectEventsState, (state) => state.events);
export const selectTotalCount = createSelector(selectEventsState, (state) => state.totalCount);
export const selectIsLoading = createSelector(selectEventsState, (state) => state.isLoading);
export const selectError = createSelector(selectEventsState, (state) => state.error);
