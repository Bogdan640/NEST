import { Response } from 'express';
import { retrievePlatformResources, createTargetResource, reserveTargetResource } from '../../services/shed/shedService';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';

export const getResourcesController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const executedRetrieval = await retrievePlatformResources();
    res.status(200).json(executedRetrieval);
  } catch (executionError: unknown) {
    res.status(500).json({ error: 'Failed to retrieve shed resources' });
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
