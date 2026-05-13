import { Router } from 'express';
import { getPostsController, createPostController, updateFeedController, deleteFeedController, getPostByIdController, getFeedStatusController, uploadFeedImageController } from '../../controllers/feed/feedController';
import { requireAuthentication, requireVerified } from '../../middlewares/authMiddleware';
import { upload } from '../../config/upload';

const feedRouter = Router();

feedRouter.use(requireAuthentication);
feedRouter.use(requireVerified);
feedRouter.get('/status', getFeedStatusController);
feedRouter.get('/', getPostsController);
feedRouter.get('/:id', getPostByIdController);
feedRouter.post('/', createPostController);
feedRouter.post('/image', upload.single('image'), uploadFeedImageController);
feedRouter.put('/:id', updateFeedController);
feedRouter.delete('/:id', deleteFeedController);

export default feedRouter;
