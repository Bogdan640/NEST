import { Response, NextFunction } from 'express';
import { getCurrentUserProfile, getUserProfileById, updateUserProfile, updateUserPreferences } from '../../services/user/userService';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';
import prisma from '../../config/prisma';

export const getMeController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ message: 'Authentication missing' });
    return;
  }

  try {
    const result = await getCurrentUserProfile(req.user.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getUserProfileById(req.params.id as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateMeController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ message: 'Authentication missing' });
    return;
  }

  try {
    const result = await updateUserProfile(req.user.userId, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updatePreferencesController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ message: 'Authentication missing' });
    return;
  }

  try {
    const result = await updateUserPreferences(req.user.userId, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const uploadProfileImageController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ message: 'Authentication missing' });
    return;
  }

  try {
    if (!req.file) {
      res.status(400).json({ message: 'No image file provided' });
      return;
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const updated = await prisma.user.update({
      where: { id: req.user.userId },
      data: { profileImage: imageUrl },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        apartmentNumber: true, phoneNumber: true, profileImage: true,
        coverImage: true, headline: true, about: true, preferences: true,
        role: true, isVerified: true, blockId: true, createdAt: true
      }
    });

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const uploadCoverImageController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ message: 'Authentication missing' });
    return;
  }

  try {
    if (!req.file) {
      res.status(400).json({ message: 'No image file provided' });
      return;
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const updated = await prisma.user.update({
      where: { id: req.user.userId },
      data: { coverImage: imageUrl },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        apartmentNumber: true, phoneNumber: true, profileImage: true,
        coverImage: true, headline: true, about: true, preferences: true,
        role: true, isVerified: true, blockId: true, createdAt: true
      }
    });

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};
