import { Router } from 'express';
import { getAnnouncementsController, createAnnouncementController, applyAnnouncementController, approveApplicationController, deleteAnnouncementController, getAnnouncementByIdController } from '../../controllers/parking/parkingController';
import { requireAuthentication } from '../../middlewares/authMiddleware';

const parkingRouter = Router();

parkingRouter.use(requireAuthentication);

parkingRouter.get('/', getAnnouncementsController);
parkingRouter.get('/:id', getAnnouncementByIdController);
parkingRouter.post('/', createAnnouncementController);
parkingRouter.post('/:id/apply', applyAnnouncementController);
parkingRouter.post('/applications/:applicationId/approve', approveApplicationController);
parkingRouter.delete('/:id', deleteAnnouncementController);

export default parkingRouter;
