import { Router } from 'express';
import { getPostsController, createPostController } from '../../controllers/feed/feedController';
import { requireAuthentication } from '../../middlewares/authMiddleware';

const feedRouter = Router();

feedRouter.use(requireAuthentication);
feedRouter.get('/', getPostsController);
feedRouter.post('/', createPostController);

export default feedRouter;
