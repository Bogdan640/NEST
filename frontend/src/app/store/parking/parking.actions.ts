import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { ParkingAnnouncement, ParkingSlot, CreateAnnouncementRequest, CreateParkingSlotRequest } from '../../core/models/parking.model';
import { PaginatedResponse, PaginationParams } from '../../core/models/paginated-response.model';

export const ParkingActions = createActionGroup({
  source: 'Parking',
  events: {
    'Load Announcements': props<{ params: PaginationParams }>(),
    'Load Announcements Success': props<{ response: PaginatedResponse<ParkingAnnouncement> }>(),
    'Load Announcements Failure': props<{ error: string }>(),

    'Create Announcement': props<{ request: CreateAnnouncementRequest }>(),
    'Create Announcement Success': props<{ announcement: ParkingAnnouncement }>(),
    'Create Announcement Failure': props<{ error: string }>(),

    'Delete Announcement': props<{ id: string }>(),
    'Delete Announcement Success': props<{ id: string }>(),
    'Delete Announcement Failure': props<{ error: string }>(),

    'Apply To Announcement': props<{ id: string }>(),
    'Apply To Announcement Success': props<{ id: string }>(),
    'Apply To Announcement Failure': props<{ error: string }>(),

    'Approve Application': props<{ applicationId: string }>(),
    'Approve Application Success': props<{ applicationId: string }>(),
    'Approve Application Failure': props<{ error: string }>(),

    'Load Slots': emptyProps(),
    'Load Slots Success': props<{ slots: ParkingSlot[] }>(),
    'Load Slots Failure': props<{ error: string }>(),

    'Create Slot': props<{ request: CreateParkingSlotRequest }>(),
    'Create Slot Success': props<{ slot: ParkingSlot }>(),
    'Create Slot Failure': props<{ error: string }>(),
  },
});
