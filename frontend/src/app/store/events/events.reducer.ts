import { createReducer, on } from '@ngrx/store';
import { initialEventsState } from './events.state';
import { EventsActions } from './events.actions';

export const eventsReducer = createReducer(
  initialEventsState,
  on(EventsActions.loadEvents, (state) => ({ ...state, isLoading: true, error: null })),
  on(EventsActions.loadEventsSuccess, (state, { response }) => ({
    ...state,
    isLoading: false,
    events: response.data,
    totalCount: response.total,
  })),
  on(EventsActions.loadEventsFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(EventsActions.createEvent, (state) => ({ ...state, isLoading: true, error: null })),
  on(EventsActions.createEventSuccess, (state, { event }) => ({
    ...state,
    isLoading: false,
    events: [event, ...state.events],
    totalCount: state.totalCount + 1,
  })),
  on(EventsActions.createEventFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(EventsActions.updateEvent, (state) => ({ ...state, isLoading: true, error: null })),
  on(EventsActions.updateEventSuccess, (state, { event }) => ({
    ...state,
    isLoading: false,
    events: state.events.map((e) => (e.id === event.id ? event : e)),
  })),
  on(EventsActions.updateEventFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(EventsActions.deleteEvent, (state) => ({ ...state, isLoading: true, error: null })),
  on(EventsActions.deleteEventSuccess, (state, { id }) => ({
    ...state,
    isLoading: false,
    events: state.events.filter((e) => e.id !== id),
    totalCount: state.totalCount - 1,
  })),
  on(EventsActions.deleteEventFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(EventsActions.joinEvent, (state) => ({ ...state, isLoading: true, error: null })),
  on(EventsActions.joinEventFailure, (state, { error }) => ({ ...state, isLoading: false, error })),
  
  on(EventsActions.leaveEvent, (state) => ({ ...state, isLoading: true, error: null })),
  on(EventsActions.leaveEventFailure, (state, { error }) => ({ ...state, isLoading: false, error }))
);
