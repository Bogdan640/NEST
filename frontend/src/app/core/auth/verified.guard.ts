import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { selectIsVerified } from '../../store/auth/auth.selectors';

export const verifiedGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsVerified).pipe(
    take(1),
    map((isVerified) => {
      if (isVerified) {
        return true;
      }
      return router.createUrlTree(['/pending']);
    })
  );
};
