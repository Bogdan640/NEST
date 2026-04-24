import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ShedFacade } from '../../store/shed/shed.facade';

export const shedResolver: ResolveFn<boolean> = () => {
  const facade = inject(ShedFacade);
  facade.loadResources({ page: 1, limit: 20 });
  return true;
};
