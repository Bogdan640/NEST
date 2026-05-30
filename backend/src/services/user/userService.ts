import prisma from '../../config/prisma';
import { NotFoundError } from '../../utils/errors';

const DEFAULT_PREFERENCES = {
  theme: 'light',
  isPhonePublic: false,
  notifyResourceAvailable: true,
  notifyEventReminders: true,
  notifyNewPosts: true,
  browserNotifications: false,
};

const USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  apartmentNumber: true,
  phoneNumber: true,
  profileImage: true,
  coverImage: true,
  headline: true,
  about: true,
  preferences: true,
  role: true,
  isVerified: true,
  blockId: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Safely parse the preferences JSON string and merge with defaults
 * so existing users without new fields still get them.
 */
function parsePreferences(prefsString: string): Record<string, unknown> {
  try {
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(prefsString) };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

/**
 * Transform a raw user row: parse the preferences JSON string into an object.
 */
function transformUser(user: any) {
  return {
    ...user,
    preferences: parsePreferences(user.preferences),
  };
}

export const getCurrentUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...USER_SELECT,
      block: { select: { id: true, name: true, address: true } },
    }
  });

  if (!user) throw new NotFoundError('User not found');
  return transformUser(user);
};

export const getUserProfileById = async (targetUserId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: {
      ...USER_SELECT,
      block: { select: { id: true, name: true } },
    }
  });

  if (!user) throw new NotFoundError('User not found');

  const result = transformUser(user);
  if (!result.preferences.isPhonePublic) {
    delete result.phoneNumber;
  }

  return result;
};

export const updateUserProfile = async (
  userId: string,
  data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    headline?: string;
    about?: string;
    profileImage?: string;
    coverImage?: string;
  }
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User not found');

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: USER_SELECT,
  });

  return transformUser(updated);
};

export const updateUserPreferences = async (userId: string, preferences: Record<string, unknown>) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User not found');

  const currentPrefs = parsePreferences(user.preferences);
  const updatedPrefs = { ...currentPrefs, ...preferences };

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { preferences: JSON.stringify(updatedPrefs) },
    select: USER_SELECT,
  });

  return transformUser(updated);
};
