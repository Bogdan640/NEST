export interface ParkingSlot {
  id: string;
  identifier: string;
  ownerId: string;
  owner?: ParkingSlotOwner;
  createdAt: string;
  updatedAt: string;
}

export interface ParkingSlotOwner {
  id: string;
  firstName: string;
  lastName: string;
}

export interface ParkingAnnouncement {
  id: string;
  parkingSlotId: string;
  parkingSlot: ParkingSlot;
  publisherId: string;
  publisher?: ParkingSlotOwner;
  availableFrom: string;
  availableTo: string;
  applications: ParkingApplication[];
  createdAt: string;
  updatedAt: string;
}

export interface ParkingApplication {
  id: string;
  announcementId: string;
  applicantId: string;
  applicant?: ParkingSlotOwner;
  status: ParkingApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export type ParkingApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CreateParkingSlotRequest {
  identifier: string;
}

export interface CreateAnnouncementRequest {
  parkingSlotId: string;
  availableFrom: string;
  availableTo: string;
}
