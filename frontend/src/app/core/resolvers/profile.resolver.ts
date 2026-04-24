import { ResolveFn } from '@angular/router';

export const profileResolver: ResolveFn<boolean> = () => {
  // Rely on Auth store's currentUser
  return true;
};
