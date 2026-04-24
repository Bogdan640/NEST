import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import {
  selectCurrentUser,
  selectToken,
  selectPermissions,
  selectAuthIsLoading,
  selectAuthError,
  selectIsAuthenticated,
  selectIsVerified,
  selectIsAdmin,
  selectUserFullName,
} from './auth.selectors';
import { User } from '../../core/models/user.model';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../../core/constants/ui';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private store = inject(Store);

  currentUser = this.store.selectSignal(selectCurrentUser);
  token = this.store.selectSignal(selectToken);
  permissions = this.store.selectSignal(selectPermissions);
  isLoading = this.store.selectSignal(selectAuthIsLoading);
  error = this.store.selectSignal(selectAuthError);
  isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  isVerified = this.store.selectSignal(selectIsVerified);
  isAdmin = this.store.selectSignal(selectIsAdmin);
  userFullName = this.store.selectSignal(selectUserFullName);

  login(email: string, password: string): void {
    this.store.dispatch(AuthActions.login({ email, password }));
  }

  register(email: string, password: string, firstName: string, lastName: string, apartmentNumber: string): void {
    this.store.dispatch(AuthActions.register({ email, password, firstName, lastName, apartmentNumber }));
  }

  joinBlock(blockCode: string): void {
    this.store.dispatch(AuthActions.joinBlock({ blockCode }));
  }

  loadPermissions(): void {
    this.store.dispatch(AuthActions.loadPermissions());
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  clearError(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  tryRestoreSession(): void {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const userJson = localStorage.getItem(USER_STORAGE_KEY);

    if (token && userJson) {
      const user: User = JSON.parse(userJson);
      this.store.dispatch(AuthActions.restoreSession({ user, token }));
      this.loadPermissions();
    }
  }

  hasPermission(permission: string): boolean {
    return this.permissions().includes(permission);
  }
}
