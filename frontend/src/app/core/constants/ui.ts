export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_SHED_PAGE_SIZE = 20;
export const DEFAULT_PARKING_PAGE_SIZE = 10;
export const FIRST_PAGE = 1;

export const ANIMATION_DURATION_MS = 300;
export const DEBOUNCE_TIME_MS = 400;

export const TOKEN_STORAGE_KEY = 'nest_auth_token';
export const USER_STORAGE_KEY = 'nest_auth_user';
export const THEME_STORAGE_KEY = 'nest_theme';

export const NAV_ITEMS = [
  { path: '/app/feed', emoji: '🐦', label: 'Feed' },
  { path: '/app/events', emoji: '🦉', label: 'Events' },
  { path: '/app/shed', emoji: '🦝', label: 'Shared Shed' },
  { path: '/app/parking', emoji: '🐢', label: 'Parking' },
  { path: '/app/profile', emoji: '👤', label: 'Profile' },
] as const;
