import express from 'express';
import cors from 'cors';
import { swaggerServe, swaggerSetup } from './config/swagger';
import authRouter from './routes/auth/authRoutes';
import feedRouter from './routes/feed/feedRoutes';
import eventsRouter from './routes/events/eventsRoutes';
import shedRouter from './routes/shed/shedRoutes';
import parkingRouter from './routes/parking/parkingRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerServe, swaggerSetup);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/feed', feedRouter);
app.use('/api/v1/events', eventsRouter);
app.use('/api/v1/shed', shedRouter);
app.use('/api/v1/parking', parkingRouter);

export default app;
