import { createActionGroup, props } from '@ngrx/store';
import { NestEvent, CreateEventRequest, UpdateEventRequest } from '../../core/models/event.model';
import { PaginatedResponse, PaginationParams } from '../../core/models/paginated-response.model';

export const EventsActions = createActionGroup({
  source: 'Events',
  events: {
    'Load Events': props<{ params: PaginationParams }>(),
    'Load Events Success': props<{ response: PaginatedResponse<NestEvent> }>(),
    'Load Events Failure': props<{ error: string }>(),

    'Create Event': props<{ request: CreateEventRequest }>(),
    'Create Event Success': props<{ event: NestEvent }>(),
    'Create Event Failure': props<{ error: string }>(),

    'Update Event': props<{ id: string; request: UpdateEventRequest }>(),
    'Update Event Success': props<{ event: NestEvent }>(),
    'Update Event Failure': props<{ error: string }>(),

    'Delete Event': props<{ id: string }>(),
    'Delete Event Success': props<{ id: string }>(),
    'Delete Event Failure': props<{ error: string }>(),

    'Join Event': props<{ id: string }>(),
    'Join Event Success': props<{ id: string; userId: string }>(),
    'Join Event Failure': props<{ error: string }>(),

    'Leave Event': props<{ id: string }>(),
    'Leave Event Success': props<{ id: string; userId: string }>(),
    'Leave Event Failure': props<{ error: string }>(),
  },
});
