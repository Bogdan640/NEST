import { Response, NextFunction } from 'express';
import { getResources, createResource, reserveResource, returnResource, updateResource, deleteResource, getResourceById } from '../../services/shed/shedService';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';

export const getResourcesController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await getResources(search, sortBy, sortOrder, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getResourceByIdController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getResourceById(req.params.id as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createResourceController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ message: 'Authentication missing' });
    return;
  }

  const { name, description, type, isCommunityOwned } = req.body;

  if (!name || !description || !type) {
    res.status(400).json({ message: 'Mandatory resource fields missing' });
    return;
  }

  try {
    const ownerIdParam = isCommunityOwned ? undefined : req.user.userId;
    const result = await createResource(name, description, type, ownerIdParam);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const reserveResourceController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ message: 'Authentication missing' });
    return;
  }

  const { startTime, endTime } = req.body;

  if (!startTime || !endTime) {
    res.status(400).json({ message: 'Reservation constraints missing' });
    return;
  }

  try {
    const parsedStart = new Date(startTime);
    const parsedEnd = new Date(endTime);

    const result = await reserveResource(req.user.userId, req.params.id as string, parsedStart, parsedEnd);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const returnResourceController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ message: 'Authentication missing' });
    return;
  }

  try {
    const result = await returnResource(req.user.userId, req.params.id as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateResourceController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId || !req.user?.role) {
    res.status(401).json({ message: 'Authentication missing' });
    return;
  }

  const { name, description } = req.body;

  if (!name || !description) {
    res.status(400).json({ message: 'Name and description are required' });
    return;
  }

  try {
    const result = await updateResource(req.user.userId, req.params.id as string, req.user.role, name, description);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteResourceController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId || !req.user?.role) {
    res.status(401).json({ message: 'Authentication missing' });
    return;
  }

  try {
    await deleteResource(req.user.userId, req.params.id as string, req.user.role);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
