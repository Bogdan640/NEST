import { Router } from 'express';
import { getPendingUsersController, approveUserController, rejectUserController, removeUserController, getBlockResidentsController } from '../../controllers/admin/adminController';
import { requireAuthentication, requireAdminRole } from '../../middlewares/authMiddleware';

const adminRouter = Router();

adminRouter.use(requireAuthentication);
adminRouter.use(requireAdminRole);

adminRouter.get('/pending-users', getPendingUsersController);
adminRouter.post('/users/:userId/approve', approveUserController);
adminRouter.post('/users/:userId/reject', rejectUserController);
adminRouter.delete('/users/:userId', removeUserController);
adminRouter.get('/block-residents', getBlockResidentsController);

export default adminRouter;
