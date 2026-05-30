import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ShedFacade } from '../../store/shed/shed.facade';
import { DEFAULT_SHED_PAGE_SIZE, FIRST_PAGE } from '../constants/ui';

export const shedResolver: ResolveFn<boolean> = () => {
  const facade = inject(ShedFacade);
  facade.loadResources({ page: FIRST_PAGE, limit: DEFAULT_SHED_PAGE_SIZE });
  return true;
};
