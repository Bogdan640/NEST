import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ParkingFacade } from '../../store/parking/parking.facade';

export const parkingResolver: ResolveFn<boolean> = () => {
  const facade = inject(ParkingFacade);
  facade.loadAnnouncements({ page: 1, limit: 10 });
  facade.loadSlots();
  return true;
};
