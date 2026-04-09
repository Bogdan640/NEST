import { Response } from 'express';
import { retrieveAllEvents, createTargetEvent, joinTargetEvent, updateEventTarget, deleteEventTarget, retrieveEventById } from '../../services/events/eventsService';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';

export const getEventsController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as string | undefined;

    const executedRetrieval = await retrieveAllEvents(search, sortBy, sortOrder);
    res.status(200).json(executedRetrieval);
  } catch (executionError: unknown) {
    res.status(500).json({ error: 'Failed to retrieve community events' });
  }
};

export const getEventByIdController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const executedRetrieval = await retrieveEventById(id as string);
    res.status(200).json(executedRetrieval);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Event untraceable') {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Failed to retrieve isolated event' });
  }
};

export const createEventController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { title, description, location, type, startTime, endTime, maxParticipants, visibility } = req.body;

  if (!title || !description || !location || !type || !startTime || !endTime) {
    res.status(400).json({ error: 'Mandatory event fields missing' });
    return;
  }

  try {
    const parsedStart = new Date(startTime);
    const parsedEnd = new Date(endTime);

    const executedCreation = await createTargetEvent(
      req.user.userId,
      title,
      description,
      location,
      type,
      parsedStart,
      parsedEnd,
      maxParticipants,
      visibility
    );
    res.status(201).json(executedCreation);
  } catch (executionError: unknown) {
    res.status(500).json({ error: 'Event creation fundamentally failed' });
  }
};

export const joinEventController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'Event ID strictly required' });
    return;
  }

  try {
    const executedJoin = await joinTargetEvent(req.user.userId, id as string);
    res.status(200).json(executedJoin);
  } catch (executionError: unknown) {
    if (executionError instanceof Error) {
      if (executionError.message === 'Event capacity completely maximized' || executionError.message === 'Resident heavily duplicated attendance') {
        res.status(409).json({ error: executionError.message });
        return;
      }
      if (executionError.message === 'Event could not be located') {
        res.status(404).json({ error: executionError.message });
        return;
      }
    }
    res.status(500).json({ error: 'Failed to join targeted event' });
  }
};

export const updateEventController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user?.userId || !req.user?.role) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { id } = req.params;
  const { title, description } = req.body;

  if (!id || !title || !description) {
    res.status(400).json({ error: 'Payload configuration missing parameters' });
    return;
  }

  try {
    const executedUpdate = await updateEventTarget(req.user.userId, id as string, req.user.role, title, description);
    res.status(200).json(executedUpdate);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Event untraceable') {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === 'Unauthorized operational jurisdiction') {
        res.status(403).json({ error: error.message });
        return;
      }
    }
    res.status(500).json({ error: 'Event synchronization failed' });
  }
};

export const deleteEventController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user?.userId || !req.user?.role) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { id } = req.params;

  try {
    await deleteEventTarget(req.user.userId, id as string, req.user.role);
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Event untraceable') {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === 'Unauthorized operational jurisdiction') {
        res.status(403).json({ error: error.message });
        return;
      }
    }
    res.status(500).json({ error: 'Event synchronization failed' });
  }
};
