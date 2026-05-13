import { Router } from 'express';
import { getMeController, getUserByIdController, updateMeController, updatePreferencesController } from '../../controllers/user/userController';
import { requireAuthentication, requireVerified } from '../../middlewares/authMiddleware';
import { upload } from '../../config/upload';
import { uploadProfileImageController, uploadCoverImageController } from '../../controllers/user/userController';

const userRouter = Router();

userRouter.use(requireAuthentication);
userRouter.use(requireVerified);

userRouter.get('/me', getMeController);
userRouter.put('/me', updateMeController);
userRouter.put('/me/preferences', updatePreferencesController);
userRouter.post('/me/profile-image', upload.single('profileImage'), uploadProfileImageController);
userRouter.post('/me/cover-image', upload.single('coverImage'), uploadCoverImageController);
userRouter.get('/:id', getUserByIdController);

export default userRouter;
