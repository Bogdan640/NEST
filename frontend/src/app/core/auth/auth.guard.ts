import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TOKEN_STORAGE_KEY } from '../constants/ui';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
