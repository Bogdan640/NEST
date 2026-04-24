import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User, LoginRequest, RegisterRequest, JoinBlockRequest } from '../../core/models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<LoginRequest>(),
    'Login Success': props<{ user: User; token: string; permissions: string[] }>(),
    'Login Failure': props<{ error: string }>(),

    'Register': props<RegisterRequest>(),
    'Register Success': props<{ user: User; token: string }>(),
    'Register Failure': props<{ error: string }>(),

    'Join Block': props<JoinBlockRequest>(),
    'Join Block Success': emptyProps(),
    'Join Block Failure': props<{ error: string }>(),

    'Load Permissions': emptyProps(),
    'Load Permissions Success': props<{ permissions: string[] }>(),

    'Restore Session': props<{ user: User; token: string }>(),
    'Logout': emptyProps(),
    'Clear Error': emptyProps(),
  },
});
