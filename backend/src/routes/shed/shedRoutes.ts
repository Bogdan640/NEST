import { Router } from 'express';
import { getResourcesController, createResourceController, reserveResourceController, updateResourceController, deleteResourceController, getResourceByIdController } from '../../controllers/shed/shedController';
import { requireAuthentication } from '../../middlewares/authMiddleware';

const shedRouter = Router();

shedRouter.use(requireAuthentication);

shedRouter.get('/', getResourcesController);
shedRouter.get('/:id', getResourceByIdController);
shedRouter.post('/', createResourceController);
shedRouter.post('/:id/reserve', reserveResourceController);
shedRouter.put('/:id', updateResourceController);
shedRouter.delete('/:id', deleteResourceController);

export default shedRouter;
