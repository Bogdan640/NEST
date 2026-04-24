import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { feedReducer } from './store/feed/feed.reducer';
import { FeedEffects } from './store/feed/feed.effects';
import { eventsReducer } from './store/events/events.reducer';
import { EventsEffects } from './store/events/events.effects';
import { shedReducer } from './store/shed/shed.reducer';
import { ShedEffects } from './store/shed/shed.effects';
import { parkingReducer } from './store/parking/parking.reducer';
import { ParkingEffects } from './store/parking/parking.effects';
import { authInterceptor } from './core/auth/auth.interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    provideStore({ auth: authReducer, feed: feedReducer, events: eventsReducer, shed: shedReducer, parking: parkingReducer }),
    provideEffects([AuthEffects, FeedEffects, EventsEffects, ShedEffects, ParkingEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
};
