export const EVENT_TYPES = ['MEETING', 'SOCIAL', 'MAINTENANCE', 'OTHER'] as const;
export type EventTypeValue = typeof EVENT_TYPES[number];

export const EVENT_VISIBILITY = ['ALL', 'BUILDING', 'FLOOR'] as const;
export type EventVisibilityValue = typeof EVENT_VISIBILITY[number];

export const EVENT_TYPE_LABELS: Record<EventTypeValue, string> = {
  MEETING: 'Meeting',
  SOCIAL: 'Social',
  MAINTENANCE: 'Maintenance',
  OTHER: 'Other',
};

export const EVENT_TYPE_EMOJIS: Record<EventTypeValue, string> = {
  MEETING: '🤝',
  SOCIAL: '🎈',
  MAINTENANCE: '🔧',
  OTHER: '🌿',
};
