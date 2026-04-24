import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { AuthActions } from './auth.actions';
import { AuthApiService } from '../../core/api/auth-api.service';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../../core/constants/ui';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authApi = inject(AuthApiService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) =>
        this.authApi.login({ email, password }).pipe(
          map((response) =>
            AuthActions.loginSuccess({
              user: response.user,
              token: response.token,
              permissions: response.permissions,
            })
          ),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.error?.message || 'Login failed' }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user, token }) => {
          localStorage.setItem(TOKEN_STORAGE_KEY, token);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

          if (!user.isVerified) {
            this.router.navigate(['/pending']);
          } else {
            this.router.navigate(['/app/feed']);
          }
        })
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ email, password, firstName, lastName, apartmentNumber }) =>
        this.authApi.register({ email, password, firstName, lastName, apartmentNumber }).pipe(
          map((response) =>
            AuthActions.registerSuccess({ user: response.user, token: response.token })
          ),
          catchError((error) =>
            of(AuthActions.registerFailure({ error: error.error?.message || 'Registration failed' }))
          )
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(({ user, token }) => {
          localStorage.setItem(TOKEN_STORAGE_KEY, token);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
          this.router.navigate(['/join']);
        })
      ),
    { dispatch: false }
  );

  joinBlock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.joinBlock),
      exhaustMap(({ blockCode }) =>
        this.authApi.joinBlock({ blockCode }).pipe(
          map(() => AuthActions.joinBlockSuccess()),
          catchError((error) =>
            of(AuthActions.joinBlockFailure({ error: error.error?.message || 'Join block failed' }))
          )
        )
      )
    )
  );

  joinBlockSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.joinBlockSuccess),
        tap(() => this.router.navigate(['/pending']))
      ),
    { dispatch: false }
  );

  loadPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadPermissions),
      exhaustMap(() =>
        this.authApi.getPermissions().pipe(
          map((response) => AuthActions.loadPermissionsSuccess({ permissions: response.permissions })),
          catchError(() => of(AuthActions.loadPermissionsSuccess({ permissions: [] })))
        )
      )
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
