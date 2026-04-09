import { Router } from 'express';
import { getAnnouncementsController, createAnnouncementController, applyAnnouncementController, approveApplicationController } from '../../controllers/parking/parkingController';
import { requireAuthentication } from '../../middlewares/authMiddleware';

const parkingRouter = Router();

parkingRouter.use(requireAuthentication);

parkingRouter.get('/', getAnnouncementsController);
parkingRouter.post('/', createAnnouncementController);
parkingRouter.post('/:id/apply', applyAnnouncementController);
parkingRouter.post('/applications/:applicationId/approve', approveApplicationController);

export default parkingRouter;
