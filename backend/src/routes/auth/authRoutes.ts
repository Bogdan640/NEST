import { Router } from 'express';
import { loginResident, registerResidentController, joinBlockController, getPermissionsController } from '../../controllers/auth/authController';
import { requireAuthentication } from '../../middlewares/authMiddleware';

const authRouter = Router();

authRouter.post('/login', loginResident);
authRouter.post('/register', registerResidentController);
authRouter.post('/join-block', requireAuthentication, joinBlockController);
authRouter.get('/permissions', requireAuthentication, getPermissionsController);

export default authRouter;
