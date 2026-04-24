import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.login, AuthActions.register, AuthActions.joinBlock, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { user, token, permissions }) => ({
    ...state,
    user,
    token,
    permissions,
    isLoading: false,
    error: null,
  })),

  on(AuthActions.registerSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isLoading: false,
    error: null,
  })),

  on(AuthActions.joinBlockSuccess, (state) => ({
    ...state,
    isLoading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, AuthActions.registerFailure, AuthActions.joinBlockFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(AuthActions.loadPermissionsSuccess, (state, { permissions }) => ({
    ...state,
    permissions,
  })),

  on(AuthActions.restoreSession, (state, { user, token }) => ({
    ...state,
    user,
    token,
  })),

  on(AuthActions.logout, () => initialAuthState),

  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null,
  })),
);
