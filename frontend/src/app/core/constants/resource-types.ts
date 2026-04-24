export const RESOURCE_TYPES = ['TOOL', 'BOOK', 'OTHER'] as const;
export type ResourceTypeValue = typeof RESOURCE_TYPES[number];

export const RESOURCE_TYPE_LABELS: Record<ResourceTypeValue, string> = {
  TOOL: 'Tool',
  BOOK: 'Book',
  OTHER: 'Other',
};

export const RESOURCE_TYPE_EMOJIS: Record<ResourceTypeValue, string> = {
  TOOL: '🪚',
  BOOK: '📚',
  OTHER: '📦',
};

export const RESERVATION_STATUSES = ['PENDING', 'APPROVED', 'RETURNED', 'CANCELLED'] as const;
