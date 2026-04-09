import { Router } from 'express';
import { getResourcesController, createResourceController, reserveResourceController } from '../../controllers/shed/shedController';
import { requireAuthentication } from '../../middlewares/authMiddleware';

const shedRouter = Router();

shedRouter.use(requireAuthentication);

shedRouter.get('/', getResourcesController);
shedRouter.post('/', createResourceController);
shedRouter.post('/:id/reserve', reserveResourceController);

export default shedRouter;
