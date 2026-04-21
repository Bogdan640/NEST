import { Router } from 'express';
import { getAnnouncementsController, createAnnouncementController, applyAnnouncementController, approveApplicationController, deleteAnnouncementController, getAnnouncementByIdController, getSlotsController, createSlotController } from '../../controllers/parking/parkingController';
import { requireAuthentication, requireVerified } from '../../middlewares/authMiddleware';

const parkingRouter = Router();

parkingRouter.use(requireAuthentication);
parkingRouter.use(requireVerified);

parkingRouter.get('/', getAnnouncementsController);
parkingRouter.get('/slots', getSlotsController);
parkingRouter.post('/slots', createSlotController);
parkingRouter.get('/:id', getAnnouncementByIdController);
parkingRouter.post('/', createAnnouncementController);
parkingRouter.post('/:id/apply', applyAnnouncementController);
parkingRouter.post('/applications/:applicationId/approve', approveApplicationController);
parkingRouter.delete('/:id', deleteAnnouncementController);

export default parkingRouter;
