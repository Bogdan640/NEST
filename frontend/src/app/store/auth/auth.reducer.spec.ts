import { authReducer } from './auth.reducer';
import { initialAuthState } from './auth.state';
import { AuthActions } from './auth.actions';
import { User } from '../../core/models/user.model';

describe('AuthReducer', () => {
  it('should return the initial state', () => {
    const action = { type: 'Unknown' };
    const state = authReducer(initialAuthState, action);

    expect(state).toBe(initialAuthState);
  });

  it('should set isLoading to true on login', () => {
    const action = AuthActions.login({ email: 'test@test.com', password: 'password' });
    const state = authReducer(initialAuthState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should update state with user on loginSuccess', () => {
    const mockUser: any = { id: '1', firstName: 'John', lastName: 'Doe', email: 'test@test.com' };
    const action = AuthActions.loginSuccess({ user: mockUser, token: 'token123', permissions: [] });
    const state = authReducer(initialAuthState, action);

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('token123');
  });

  it('should reset state on logout', () => {
    const action = AuthActions.logout();
    const mockState = { ...initialAuthState, user: { id: '1' } as any, token: 'token123' };
    const state = authReducer(mockState, action);

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});
