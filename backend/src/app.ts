import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { swaggerServe, swaggerSetup } from './config/swagger';
import { globalErrorHandler } from './middlewares/errorHandler';
import { generalLimiter, authLimiter } from './middlewares/rateLimiter';
import authRouter from './routes/auth/authRoutes';
import feedRouter from './routes/feed/feedRoutes';
import eventsRouter from './routes/events/eventsRoutes';
import shedRouter from './routes/shed/shedRoutes';
import parkingRouter from './routes/parking/parkingRoutes';
import userRouter from './routes/user/userRoutes';
import adminRouter from './routes/admin/adminRoutes';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200' }));
app.use(express.json());
app.use(morgan('dev'));
app.use(generalLimiter);

app.use('/api-docs', swaggerServe, swaggerSetup);
app.use('/api/v1/auth', authLimiter, authRouter);
app.use('/api/v1/feed', feedRouter);
app.use('/api/v1/events', eventsRouter);
app.use('/api/v1/shed', shedRouter);
app.use('/api/v1/parking', parkingRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/admin', adminRouter);

app.use(globalErrorHandler);

export default app;
