import prisma from '../../config/prisma';
import { NotFoundError } from '../../utils/errors';

export const getCurrentUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      apartmentNumber: true,
      phoneNumber: true,
      profileImage: true,
      headline: true,
      about: true,
      preferences: true,
      role: true,
      isVerified: true,
      blockId: true,
      block: { select: { id: true, name: true, address: true } },
      createdAt: true
    }
  });

  if (!user) throw new NotFoundError('User not found');
  return user;
};

export const getUserProfileById = async (targetUserId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      apartmentNumber: true,
      profileImage: true,
      headline: true,
      about: true,
      preferences: true,
      role: true,
      block: { select: { id: true, name: true } },
      createdAt: true
    }
  });

  if (!user) throw new NotFoundError('User not found');

  const prefs = JSON.parse(user.preferences);
  const result: any = { ...user };
  if (!prefs.isPhonePublic) {
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
  }
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User not found');

  return await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      apartmentNumber: true,
      phoneNumber: true,
      profileImage: true,
      headline: true,
      about: true,
      preferences: true,
      role: true,
      isVerified: true,
      blockId: true
    }
  });
};

export const updateUserPreferences = async (userId: string, preferences: { theme?: string; isPhonePublic?: boolean }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User not found');

  const currentPrefs = JSON.parse(user.preferences);
  const updatedPrefs = { ...currentPrefs, ...preferences };

  return await prisma.user.update({
    where: { id: userId },
    data: { preferences: JSON.stringify(updatedPrefs) },
    select: {
      id: true,
      preferences: true
    }
  });
};
