export const ROLES = {
  ADMIN: 'ADMIN',
  RESIDENT: 'RESIDENT'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ADMIN_FEATURES = [
  'delete_any_post',
  'delete_any_event',
  'delete_any_resource',
  'delete_any_announcement',
  'update_any_post',
  'update_any_event',
  'update_any_resource',
  'manage_users',
  'manage_blocks'
] as const;

export type AdminFeature = typeof ADMIN_FEATURES[number];

export const EVENT_TYPES = ['MEETING', 'SOCIAL', 'MAINTENANCE', 'OTHER'] as const;
export const EVENT_VISIBILITY = ['ALL', 'BUILDING', 'FLOOR'] as const;
export const RESOURCE_TYPES = ['TOOL', 'BOOK', 'OTHER'] as const;
export const RESERVATION_STATUS = ['PENDING', 'APPROVED', 'RETURNED', 'CANCELLED'] as const;
export const JOIN_REQUEST_STATUS = ['PENDING', 'APPROVED', 'REJECTED'] as const;
export const PARKING_APP_STATUS = ['PENDING', 'APPROVED', 'REJECTED'] as const;

export const getPermissionsForRole = (role: string): readonly string[] => {
  if (role === ROLES.ADMIN) return ADMIN_FEATURES;
  return [];
};
