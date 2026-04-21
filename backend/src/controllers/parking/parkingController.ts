import { Response, NextFunction } from 'express';
import { retrievePlatformAnnouncements, createTargetAnnouncement, applyForTargetAnnouncement, approveTargetApplication, deleteParkingAnnouncement, retrieveAnnouncementById, getAllParkingSlots, createParkingSlot } from '../../services/parking/parkingService';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';

export const getAnnouncementsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await retrievePlatformAnnouncements(search, sortBy, sortOrder, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAnnouncementByIdController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await retrieveAnnouncementById(req.params.id as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createAnnouncementController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { parkingSlotId, availableFrom, availableTo } = req.body;

  if (!parkingSlotId || !availableFrom || !availableTo) {
    res.status(400).json({ error: 'Mandatory announcement fields missing' });
    return;
  }

  try {
    const parsedStart = new Date(availableFrom);
    const parsedEnd = new Date(availableTo);
    const result = await createTargetAnnouncement(req.user.userId, parkingSlotId, parsedStart, parsedEnd);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const applyAnnouncementController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  try {
    const result = await applyForTargetAnnouncement(req.user.userId, req.params.id as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const approveApplicationController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  try {
    const result = await approveTargetApplication(req.user.userId, req.params.applicationId as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncementController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId || !req.user?.role) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  try {
    await deleteParkingAnnouncement(req.user.userId, req.params.id as string, req.user.role);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getSlotsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getAllParkingSlots();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createSlotController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { identifier } = req.body;

  if (!identifier) {
    res.status(400).json({ error: 'Parking slot identifier is required' });
    return;
  }

  try {
    const result = await createParkingSlot(req.user.userId, identifier);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
