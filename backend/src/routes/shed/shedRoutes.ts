import { Router } from 'express';
import { getResourcesController, createResourceController, reserveResourceController, returnResourceController, updateResourceController, deleteResourceController, getResourceByIdController } from '../../controllers/shed/shedController';
import { requireAuthentication, requireVerified } from '../../middlewares/authMiddleware';

const shedRouter = Router();

shedRouter.use(requireAuthentication);
shedRouter.use(requireVerified);

shedRouter.get('/', getResourcesController);
shedRouter.get('/:id', getResourceByIdController);
shedRouter.post('/', createResourceController);
shedRouter.post('/:id/reserve', reserveResourceController);
shedRouter.post('/:id/return', returnResourceController);
shedRouter.put('/:id', updateResourceController);
shedRouter.delete('/:id', deleteResourceController);

export default shedRouter;
