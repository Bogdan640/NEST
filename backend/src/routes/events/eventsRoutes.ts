import { Router } from 'express';
import { getEventsController, createEventController, joinEventController } from '../../controllers/events/eventsController';
import { requireAuthentication } from '../../middlewares/authMiddleware';

const eventsRouter = Router();

eventsRouter.use(requireAuthentication);

eventsRouter.get('/', getEventsController);
eventsRouter.post('/', createEventController);
eventsRouter.post('/:id/join', joinEventController);

export default eventsRouter;
