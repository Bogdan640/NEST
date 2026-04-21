import { Router } from 'express';
import { getMeController, getUserByIdController, updateMeController, updatePreferencesController } from '../../controllers/user/userController';
import { requireAuthentication, requireVerified } from '../../middlewares/authMiddleware';

const userRouter = Router();

userRouter.use(requireAuthentication);
userRouter.use(requireVerified);

userRouter.get('/me', getMeController);
userRouter.put('/me', updateMeController);
userRouter.put('/me/preferences', updatePreferencesController);
userRouter.get('/:id', getUserByIdController);

export default userRouter;
