export const DEFAULT_PAGE_SIZE = 10;
export const FIRST_PAGE = 1;

export const ANIMATION_DURATION_MS = 300;
export const DEBOUNCE_TIME_MS = 400;

export const TOKEN_STORAGE_KEY = 'nest_auth_token';
export const USER_STORAGE_KEY = 'nest_auth_user';

export const NAV_ITEMS = [
  { path: '/app/feed', emoji: '🐦', label: 'Feed' },
  { path: '/app/events', emoji: '🦉', label: 'Events' },
  { path: '/app/shed', emoji: '🦝', label: 'Shared Shed' },
  { path: '/app/parking', emoji: '🐢', label: 'Parking' },
] as const;
