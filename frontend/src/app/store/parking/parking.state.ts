import { ParkingAnnouncement, ParkingSlot } from '../../core/models/parking.model';

export interface ParkingState {
  announcements: ParkingAnnouncement[];
  slots: ParkingSlot[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
}

export const initialParkingState: ParkingState = {
  announcements: [],
  slots: [],
  totalCount: 0,
  isLoading: false,
  error: null,
};
