import { Response } from 'express';
import { retrievePlatformAnnouncements, createTargetAnnouncement, applyForTargetAnnouncement, approveTargetApplication } from '../../services/parking/parkingService';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware';

export const getAnnouncementsController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const executedRetrieval = await retrievePlatformAnnouncements();
    res.status(200).json(executedRetrieval);
  } catch (executionError: unknown) {
    res.status(500).json({ error: 'Failed to retrieve parking announcements' });
  }
};

export const createAnnouncementController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

    const executedCreation = await createTargetAnnouncement(
      req.user.userId,
      parkingSlotId,
      parsedStart,
      parsedEnd
    );
    res.status(201).json(executedCreation);
  } catch (executionError: unknown) {
    res.status(500).json({ error: 'Parking announcement creation failed' });
  }
};

export const applyAnnouncementController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'Announcement ID strictly required' });
    return;
  }

  try {
    const executedApplication = await applyForTargetAnnouncement(req.user.userId, id as string);
    res.status(200).json(executedApplication);
  } catch (executionError: unknown) {
    if (executionError instanceof Error) {
      if (executionError.message === 'Parking slot definitively claimed by another resident' || executionError.message === 'Resident heavily duplicated the application') {
        res.status(409).json({ error: executionError.message });
        return;
      }
      if (executionError.message === 'Parking announcement could not be traced') {
        res.status(404).json({ error: executionError.message });
        return;
      }
    }
    res.status(500).json({ error: 'Failed to process matching application' });
  }
};

export const approveApplicationController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Authentication missing' });
    return;
  }

  const { applicationId } = req.params;

  if (!applicationId) {
    res.status(400).json({ error: 'Application ID strictly required' });
    return;
  }

  try {
    const executedApproval = await approveTargetApplication(req.user.userId, applicationId as string);
    res.status(200).json(executedApproval);
  } catch (executionError: unknown) {
    if (executionError instanceof Error) {
      if (executionError.message === 'Unauthorized authorization attempt registered') {
        res.status(403).json({ error: executionError.message });
        return;
      }
      if (executionError.message === 'Parking slot definitively claimed by another resident') {
        res.status(409).json({ error: executionError.message });
        return;
      }
      if (executionError.message === 'Parking application firmly unreachable') {
        res.status(404).json({ error: executionError.message });
        return;
      }
    }
    res.status(500).json({ error: 'Failed to approve application' });
  }
};
