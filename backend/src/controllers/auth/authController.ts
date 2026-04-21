import { Response, NextFunction } from 'express';
import { authenticateResident, registerResident, joinBlock } from '../../services/auth/authService';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';
import { getPermissionsForRole } from '../../config/constants';

export const loginResident = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Missing required credentials' });
    return;
  }

  try {
    const authResult = await authenticateResident(email, password);

    if (!authResult) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    res.status(200).json(authResult);
  } catch (error) {
    next(error);
  }
};

export const registerResidentController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const { email, password, firstName, lastName, apartmentNumber } = req.body;

  if (!email || !password || !firstName || !lastName || !apartmentNumber) {
    res.status(400).json({ error: 'Missing required registration fields' });
    return;
  }

  try {
    const result = await registerResident(email, password, firstName, lastName, apartmentNumber);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const joinBlockController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { blockCode } = req.body;

  if (!blockCode) {
    res.status(400).json({ error: 'Block code is required' });
    return;
  }

  try {
    const result = await joinBlock(req.user.userId, blockCode);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPermissionsController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  res.status(200).json({
    role: req.user.role,
    permissions: getPermissionsForRole(req.user.role)
  });
};
