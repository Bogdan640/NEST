import { User } from '../../core/models/user.model';

export interface AuthState {
  user: User | null;
  token: string | null;
  permissions: string[];
  isLoading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  permissions: [],
  isLoading: false,
  error: null,
};
