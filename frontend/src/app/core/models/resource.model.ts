export interface Resource {
  id: string;
  name: string;
  description: string;
  type: ResourceType;
  ownerId: string | null;
  owner: ResourceOwner | null;
  reservations: ResourceReservation[];
  createdAt: string;
  updatedAt: string;
}

export interface ResourceOwner {
  id: string;
  firstName: string;
  lastName: string;
}

export interface ResourceReservation {
  id: string;
  resourceId: string;
  borrowerId: string;
  borrower?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

export type ResourceType = 'TOOL' | 'BOOK' | 'OTHER';
export type ReservationStatus = 'PENDING' | 'APPROVED' | 'RETURNED' | 'CANCELLED';

export interface CreateResourceRequest {
  name: string;
  description: string;
  type: ResourceType;
}

export interface UpdateResourceRequest {
  name?: string;
  description?: string;
  type?: ResourceType;
}

export interface ReserveResourceRequest {
  startTime: string;
  endTime: string;
}
