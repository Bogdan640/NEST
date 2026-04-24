export const ROLES = {
  ADMIN: 'ADMIN',
  RESIDENT: 'RESIDENT',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ADMIN_PERMISSIONS = [
  'delete_any_post',
  'delete_any_event',
  'delete_any_resource',
  'delete_any_announcement',
  'update_any_post',
  'update_any_event',
  'update_any_resource',
  'manage_users',
  'manage_blocks',
] as const;

export type AdminPermission = typeof ADMIN_PERMISSIONS[number];
