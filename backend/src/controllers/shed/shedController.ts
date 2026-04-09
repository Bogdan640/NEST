import { Response } from 'express';
import { retrievePlatformResources, createTargetResource, reserveTargetResource, updateShedResource, deleteShedResource, retrieveResourceById } from '../../services/shed/shedService';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';

export const getResourcesController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as string | undefined;

    const executedRetrieval = await retrievePlatformResources(search, sortBy, sortOrder);
    res.status(200).json(executedRetrieval);
  } catch (executionError: unknown) {
    res.status(500).json({ error: 'Failed to retrieve shed resources' });
  }
};

export const getResourceByIdController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const executedRetrieval = await retrieveResourceById(id as string);
    res.status(200).json(executedRetrieval);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Resource untraceable') {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Failed to retrieve isolated shed resource' });
  }
};

export const createResourceController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { name, description, type, isCommunityOwned } = req.body;

  if (!name || !description || !type) {
    res.status(400).json({ error: 'Mandatory resource fields missing' });
    return;
  }

  try {
    const ownerIdParam = isCommunityOwned ? undefined : req.user.userId;
    const executedCreation = await createTargetResource(name, description, type, ownerIdParam);
    res.status(201).json(executedCreation);
  } catch (executionError: unknown) {
    res.status(500).json({ error: 'Resource registration failed' });
  }
};

export const reserveResourceController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { id } = req.params;
  const { startTime, endTime } = req.body;

  if (!id || !startTime || !endTime) {
    res.status(400).json({ error: 'Reservation constraints missing' });
    return;
  }

  try {
    const parsedStart = new Date(startTime);
    const parsedEnd = new Date(endTime);

    const executedReservation = await reserveTargetResource(req.user.userId, id as string, parsedStart, parsedEnd);
    res.status(200).json(executedReservation);
  } catch (executionError: unknown) {
    if (executionError instanceof Error) {
      if (executionError.message === 'Resource experiencing mandatory cooldown phase' || executionError.message === 'Resource actively engaged elsewhere') {
        res.status(409).json({ error: executionError.message });
        return;
      }
      if (executionError.message === 'Resource utterly untraceable') {
        res.status(404).json({ error: executionError.message });
        return;
      }
    }
    res.status(500).json({ error: 'Failed to process resource reservation' });
  }
};

export const updateResourceController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user?.userId || !req.user?.role) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { id } = req.params;
  const { name, description } = req.body;

  if (!id || !name || !description) {
    res.status(400).json({ error: 'Payload configuration missing parameters' });
    return;
  }

  try {
    const executedUpdate = await updateShedResource(req.user.userId, id as string, req.user.role, name, description);
    res.status(200).json(executedUpdate);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Resource untraceable') {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === 'Unauthorized operational jurisdiction') {
        res.status(403).json({ error: error.message });
        return;
      }
    }
    res.status(500).json({ error: 'Resource synchronization failed' });
  }
};

export const deleteResourceController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user?.userId || !req.user?.role) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { id } = req.params;

  try {
    await deleteShedResource(req.user.userId, id as string, req.user.role);
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Resource untraceable') {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === 'Unauthorized operational jurisdiction') {
        res.status(403).json({ error: error.message });
        return;
      }
    }
    res.status(500).json({ error: 'Resource synchronization failed' });
  }
};
