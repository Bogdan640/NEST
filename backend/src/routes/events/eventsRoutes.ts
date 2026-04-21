import { Router } from 'express';
import { getEventsController, createEventController, joinEventController, leaveEventController, updateEventController, deleteEventController, getEventByIdController } from '../../controllers/events/eventsController';
import { requireAuthentication, requireVerified } from '../../middlewares/authMiddleware';

const eventsRouter = Router();

eventsRouter.use(requireAuthentication);
eventsRouter.use(requireVerified);

eventsRouter.get('/', getEventsController);
eventsRouter.get('/:id', getEventByIdController);
eventsRouter.post('/', createEventController);
eventsRouter.post('/:id/join', joinEventController);
eventsRouter.post('/:id/leave', leaveEventController);
eventsRouter.put('/:id', updateEventController);
eventsRouter.delete('/:id', deleteEventController);

export default eventsRouter;
