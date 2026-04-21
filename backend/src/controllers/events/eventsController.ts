import { Response, NextFunction } from 'express';
import { retrieveAllEvents, createTargetEvent, joinTargetEvent, leaveTargetEvent, updateEventTarget, deleteEventTarget, retrieveEventById } from '../../services/events/eventsService';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';

export const getEventsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await retrieveAllEvents(search, sortBy, sortOrder, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getEventByIdController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await retrieveEventById(req.params.id as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createEventController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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

    const result = await createTargetEvent(
      req.user.userId, title, description, location, type,
      parsedStart, parsedEnd, maxParticipants, visibility
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const joinEventController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  try {
    const result = await joinTargetEvent(req.user.userId, req.params.id as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const leaveEventController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  try {
    const result = await leaveTargetEvent(req.user.userId, req.params.id as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateEventController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId || !req.user?.role) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400).json({ error: 'Title and description are required' });
    return;
  }

  try {
    const result = await updateEventTarget(req.user.userId, req.params.id as string, req.user.role, title, description);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteEventController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId || !req.user?.role) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  try {
    await deleteEventTarget(req.user.userId, req.params.id as string, req.user.role);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
