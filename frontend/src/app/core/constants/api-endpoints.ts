import { environment } from '../../../environments/environment';

const BASE = environment.apiUrl;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE}/auth/login`,
    REGISTER: `${BASE}/auth/register`,
    JOIN_BLOCK: `${BASE}/auth/join-block`,
    PERMISSIONS: `${BASE}/auth/permissions`,
  },
  FEED: {
    BASE: `${BASE}/feed`,
    BY_ID: (id: string) => `${BASE}/feed/${id}`,
  },
  EVENTS: {
    BASE: `${BASE}/events`,
    BY_ID: (id: string) => `${BASE}/events/${id}`,
    JOIN: (id: string) => `${BASE}/events/${id}/join`,
    LEAVE: (id: string) => `${BASE}/events/${id}/leave`,
  },
  SHED: {
    BASE: `${BASE}/shed`,
    BY_ID: (id: string) => `${BASE}/shed/${id}`,
    RESERVE: (id: string) => `${BASE}/shed/${id}/reserve`,
    RETURN: (id: string) => `${BASE}/shed/${id}/return`,
  },
  PARKING: {
    BASE: `${BASE}/parking`,
    BY_ID: (id: string) => `${BASE}/parking/${id}`,
    APPLY: (id: string) => `${BASE}/parking/${id}/apply`,
    APPROVE_APPLICATION: (applicationId: string) => `${BASE}/parking/applications/${applicationId}/approve`,
    SLOTS: `${BASE}/parking/slots`,
  },
  USER: {
    ME: `${BASE}/users/me`,
    PREFERENCES: `${BASE}/users/me/preferences`,
    BY_ID: (id: string) => `${BASE}/users/${id}`,
  },
  ADMIN: {
    PENDING_USERS: `${BASE}/admin/pending-users`,
    APPROVE_USER: (userId: string) => `${BASE}/admin/users/${userId}/approve`,
    REJECT_USER: (userId: string) => `${BASE}/admin/users/${userId}/reject`,
    REMOVE_USER: (userId: string) => `${BASE}/admin/users/${userId}`,
  },
} as const;
