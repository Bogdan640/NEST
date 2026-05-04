import { eventsReducer } from './events.reducer';
import { initialEventsState } from './events.state';
import { EventsActions } from './events.actions';
import { NestEvent } from '../../core/models/event.model';

describe('EventsReducer', () => {
  it('should return the initial state', () => {
    const action = { type: 'Unknown' };
    const state = eventsReducer(initialEventsState, action);

    expect(state).toBe(initialEventsState);
  });

  it('should set isLoading to true on loadEvents', () => {
    const action = EventsActions.loadEvents({ params: { page: 1, limit: 10 } });
    const state = eventsReducer(initialEventsState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should update state with events on loadEventsSuccess', () => {
    const mockEvents: any = [
      { id: '1', title: 'Test Event' }
    ];
    
    const response = { data: mockEvents, total: 1, page: 1, limit: 10, totalPages: 1 };
    const action = EventsActions.loadEventsSuccess({ response });
    const state = eventsReducer(initialEventsState, action);

    expect(state.isLoading).toBe(false);
    expect(state.events).toEqual(mockEvents);
    expect(state.totalCount).toBe(1);
  });
});
