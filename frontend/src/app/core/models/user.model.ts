export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  apartmentNumber: string;
  phoneNumber: string | null;
  profileImage: string | null;
  headline: string | null;
  about: string | null;
  preferences: UserPreferences;
  role: UserRole;
  isVerified: boolean;
  blockId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  isPhonePublic: boolean;
}

export type UserRole = 'ADMIN' | 'RESIDENT';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  permissions: string[];
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  apartmentNumber: string;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export interface JoinBlockRequest {
  blockCode: string;
}

export interface JoinBlockResponse {
  message: string;
  joinRequest: JoinRequest;
}

export interface JoinRequest {
  id: string;
  userId: string;
  blockId: string;
  status: JoinRequestStatus;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export type JoinRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface PermissionsResponse {
  role: string;
  permissions: string[];
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  headline?: string;
  about?: string;
}

export interface UpdatePreferencesRequest {
  theme?: 'light' | 'dark';
  isPhonePublic?: boolean;
}
