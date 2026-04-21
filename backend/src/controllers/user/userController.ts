import { Response, NextFunction } from 'express';
import { getCurrentUserProfile, getUserProfileById, updateUserProfile, updateUserPreferences } from '../../services/user/userService';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';

export const getMeController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
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
    res.status(401).json({ error: 'Authentication missing' });
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
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  try {
    const result = await updateUserPreferences(req.user.userId, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
