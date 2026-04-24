export interface NestEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  type: EventType;
  startTime: string;
  endTime: string;
  maxParticipants: number | null;
  visibility: EventVisibility;
  creatorId: string;
  creator: EventCreator;
  attendees: EventAttendee[];
  createdAt: string;
  updatedAt: string;
}

export interface EventCreator {
  id: string;
  firstName: string;
  lastName: string;
}

export interface EventAttendee {
  userId: string;
  eventId: string;
  status: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export type EventType = 'MEETING' | 'SOCIAL' | 'MAINTENANCE' | 'OTHER';
export type EventVisibility = 'ALL' | 'BUILDING' | 'FLOOR';

export interface CreateEventRequest {
  title: string;
  description: string;
  location: string;
  type: EventType;
  startTime: string;
  endTime: string;
  maxParticipants?: number;
  visibility?: EventVisibility;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  location?: string;
  type?: EventType;
  startTime?: string;
  endTime?: string;
  maxParticipants?: number;
  visibility?: EventVisibility;
}
