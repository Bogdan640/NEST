import { AuthState } from './auth/auth.state';
import { FeedState } from './feed/feed.state';
import { EventsState } from './events/events.state';
import { ShedState } from './shed/shed.state';
import { ParkingState } from './parking/parking.state';

export interface AppState {
  auth: AuthState;
  feed: FeedState;
  events: EventsState;
  shed: ShedState;
  parking: ParkingState;
}
