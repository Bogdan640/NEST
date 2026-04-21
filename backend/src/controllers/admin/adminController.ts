import { Response, NextFunction } from 'express';
import { getPendingUsers, approveUser, rejectUser, removeUser } from '../../services/admin/adminService';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';

export const getPendingUsersController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  try {
    const result = await getPendingUsers(req.user.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const approveUserController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { joinRequestId } = req.body;

  if (!joinRequestId) {
    res.status(400).json({ error: 'Join request ID is required' });
    return;
  }

  try {
    const result = await approveUser(req.user.userId, req.params.userId as string, joinRequestId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const rejectUserController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { joinRequestId } = req.body;

  if (!joinRequestId) {
    res.status(400).json({ error: 'Join request ID is required' });
    return;
  }

  try {
    const result = await rejectUser(req.user.userId, joinRequestId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const removeUserController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  try {
    const result = await removeUser(req.user.userId, req.params.userId as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
