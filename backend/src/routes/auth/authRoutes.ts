import { Router } from 'express';
import { loginResident } from '../../controllers/auth/authController';

const authRouter = Router();

authRouter.post('/login', loginResident);

export default authRouter;
