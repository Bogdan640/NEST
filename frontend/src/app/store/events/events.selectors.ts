import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EventsState } from './events.state';

export const selectEventsState = createFeatureSelector<EventsState>('events');

export const selectEventsList = createSelector(selectEventsState, (state) => state.events);
export const selectEventsTotalCount = createSelector(selectEventsState, (state) => state.totalCount);
export const selectEventsIsLoading = createSelector(selectEventsState, (state) => state.isLoading);
export const selectEventsError = createSelector(selectEventsState, (state) => state.error);
