import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';
import { ROLES } from '../../core/constants/roles';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectCurrentUser = createSelector(selectAuthState, (state) => state.user);
export const selectToken = createSelector(selectAuthState, (state) => state.token);
export const selectPermissions = createSelector(selectAuthState, (state) => state.permissions);
export const selectAuthIsLoading = createSelector(selectAuthState, (state) => state.isLoading);
export const selectAuthError = createSelector(selectAuthState, (state) => state.error);
export const selectIsAuthenticated = createSelector(selectToken, (token) => !!token);
export const selectIsVerified = createSelector(selectCurrentUser, (user) => user?.isVerified ?? false);
export const selectIsAdmin = createSelector(selectCurrentUser, (user) => user?.role === ROLES.ADMIN);
export const selectUserFullName = createSelector(
  selectCurrentUser,
  (user) => user ? `${user.firstName} ${user.lastName}` : ''
);
