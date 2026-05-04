import { Router } from 'express';
import { getPostsController, createPostController, updateFeedController, deleteFeedController, getPostByIdController, getFeedStatusController } from '../../controllers/feed/feedController';
import { requireAuthentication, requireVerified } from '../../middlewares/authMiddleware';

const feedRouter = Router();

feedRouter.use(requireAuthentication);
feedRouter.use(requireVerified);
feedRouter.get('/status', getFeedStatusController);
feedRouter.get('/', getPostsController);
feedRouter.get('/:id', getPostByIdController);
feedRouter.post('/', createPostController);
feedRouter.put('/:id', updateFeedController);
feedRouter.delete('/:id', deleteFeedController);

export default feedRouter;
