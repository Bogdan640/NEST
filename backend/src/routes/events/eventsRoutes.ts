import { Router } from 'express';
import { getEventsController, createEventController, joinEventController, updateEventController, deleteEventController, getEventByIdController } from '../../controllers/events/eventsController';
import { requireAuthentication } from '../../middlewares/authMiddleware';

const eventsRouter = Router();

eventsRouter.use(requireAuthentication);

eventsRouter.get('/', getEventsController);
eventsRouter.get('/:id', getEventByIdController);
eventsRouter.post('/', createEventController);
eventsRouter.post('/:id/join', joinEventController);
eventsRouter.put('/:id', updateEventController);
eventsRouter.delete('/:id', deleteEventController);

export default eventsRouter;
