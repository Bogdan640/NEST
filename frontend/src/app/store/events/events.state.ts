import { NestEvent } from '../../core/models/event.model';

export interface EventsState {
  events: NestEvent[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
}

export const initialEventsState: EventsState = {
  events: [],
  totalCount: 0,
  isLoading: false,
  error: null,
};
