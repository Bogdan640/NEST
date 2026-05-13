import { Response, NextFunction } from 'express';
import { getPendingUsers, approveUser, rejectUser, removeUser, getBlockResidents } from '../../services/admin/adminService';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';
import prisma from '../../config/prisma';

export const getPendingUsersController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ message: 'Authentication missing' });
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
    res.status(401).json({ message: 'Authentication missing' });
    return;
  }

  try {
    const targetUserId = req.params.userId as string;

    // Auto-resolve the join request ID from the target user — frontend doesn't need to know it
    let joinRequestId = req.body?.joinRequestId;
    if (!joinRequestId) {
      const pendingRequest = await prisma.joinRequest.findFirst({
        where: { userId: targetUserId, status: 'PENDING' }
      });
      if (!pendingRequest) {
        res.status(404).json({ message: 'No pending join request found for this user' });
        return;
      }
      joinRequestId = pendingRequest.id;
    }

    const result = await approveUser(req.user.userId, targetUserId, joinRequestId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const rejectUserController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ message: 'Authentication missing' });
    return;
  }

  try {
    const targetUserId = req.params.userId as string;

    let joinRequestId = req.body?.joinRequestId;
    if (!joinRequestId) {
      const pendingRequest = await prisma.joinRequest.findFirst({
        where: { userId: targetUserId, status: 'PENDING' }
      });
      if (!pendingRequest) {
        res.status(404).json({ message: 'No pending join request found for this user' });
        return;
      }
      joinRequestId = pendingRequest.id;
    }

    const result = await rejectUser(req.user.userId, joinRequestId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const removeUserController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ message: 'Authentication missing' });
    return;
  }

  try {
    const result = await removeUser(req.user.userId, req.params.userId as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getBlockResidentsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ message: 'Authentication missing' });
    return;
  }

  try {
    const result = await getBlockResidents(req.user.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
