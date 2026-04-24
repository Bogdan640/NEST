import { createReducer, on } from '@ngrx/store';
import { initialShedState } from './shed.state';
import { ShedActions } from './shed.actions';

export const shedReducer = createReducer(
  initialShedState,
  on(ShedActions.loadResources, (state) => ({ ...state, isLoading: true, error: null })),
  on(ShedActions.loadResourcesSuccess, (state, { response }) => ({
    ...state,
    isLoading: false,
    resources: response.data,
    totalCount: response.total,
  })),
  on(ShedActions.loadResourcesFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(ShedActions.createResource, (state) => ({ ...state, isLoading: true, error: null })),
  on(ShedActions.createResourceSuccess, (state, { resource }) => ({
    ...state,
    isLoading: false,
    resources: [resource, ...state.resources],
    totalCount: state.totalCount + 1,
  })),
  on(ShedActions.createResourceFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(ShedActions.updateResource, (state) => ({ ...state, isLoading: true, error: null })),
  on(ShedActions.updateResourceSuccess, (state, { resource }) => ({
    ...state,
    isLoading: false,
    resources: state.resources.map((r) => (r.id === resource.id ? resource : r)),
  })),
  on(ShedActions.updateResourceFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(ShedActions.deleteResource, (state) => ({ ...state, isLoading: true, error: null })),
  on(ShedActions.deleteResourceSuccess, (state, { id }) => ({
    ...state,
    isLoading: false,
    resources: state.resources.filter((r) => r.id !== id),
    totalCount: state.totalCount - 1,
  })),
  on(ShedActions.deleteResourceFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(ShedActions.reserveResource, (state) => ({ ...state, isLoading: true, error: null })),
  on(ShedActions.reserveResourceFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(ShedActions.returnResource, (state) => ({ ...state, isLoading: true, error: null })),
  on(ShedActions.returnResourceFailure, (state, { error }) => ({ ...state, isLoading: false, error }))
);
