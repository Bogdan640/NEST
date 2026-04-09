import { Response } from 'express';
import { retrieveAllEvents, createTargetEvent, joinTargetEvent } from '../../services/events/eventsService';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';

export const getEventsController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const executedRetrieval = await retrieveAllEvents();
    res.status(200).json(executedRetrieval);
  } catch (executionError: unknown) {
    res.status(500).json({ error: 'Failed to retrieve community events' });
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
