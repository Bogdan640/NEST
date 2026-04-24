import { createReducer, on } from '@ngrx/store';
import { initialParkingState } from './parking.state';
import { ParkingActions } from './parking.actions';

export const parkingReducer = createReducer(
  initialParkingState,
  
  on(ParkingActions.loadAnnouncements, (state) => ({ ...state, isLoading: true, error: null })),
  on(ParkingActions.loadAnnouncementsSuccess, (state, { response }) => ({
    ...state,
    isLoading: false,
    announcements: response.data,
    totalCount: response.total,
  })),
  on(ParkingActions.loadAnnouncementsFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(ParkingActions.createAnnouncement, (state) => ({ ...state, isLoading: true, error: null })),
  on(ParkingActions.createAnnouncementSuccess, (state, { announcement }) => ({
    ...state,
    isLoading: false,
    announcements: [announcement, ...state.announcements],
    totalCount: state.totalCount + 1,
  })),
  on(ParkingActions.createAnnouncementFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(ParkingActions.deleteAnnouncement, (state) => ({ ...state, isLoading: true, error: null })),
  on(ParkingActions.deleteAnnouncementSuccess, (state, { id }) => ({
    ...state,
    isLoading: false,
    announcements: state.announcements.filter((a) => a.id !== id),
    totalCount: state.totalCount - 1,
  })),
  on(ParkingActions.deleteAnnouncementFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(ParkingActions.loadSlots, (state) => ({ ...state, isLoading: true, error: null })),
  on(ParkingActions.loadSlotsSuccess, (state, { slots }) => ({
    ...state,
    isLoading: false,
    slots,
  })),
  on(ParkingActions.loadSlotsFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(ParkingActions.createSlot, (state) => ({ ...state, isLoading: true, error: null })),
  on(ParkingActions.createSlotSuccess, (state, { slot }) => ({
    ...state,
    isLoading: false,
    slots: [...state.slots, slot],
  })),
  on(ParkingActions.createSlotFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(ParkingActions.applyToAnnouncement, (state) => ({ ...state, isLoading: true, error: null })),
  on(ParkingActions.applyToAnnouncementFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(ParkingActions.approveApplication, (state) => ({ ...state, isLoading: true, error: null })),
  on(ParkingActions.approveApplicationFailure, (state, { error }) => ({ ...state, isLoading: false, error }))
);
