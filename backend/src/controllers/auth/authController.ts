import { Request, Response } from 'express';
import { authenticateResident } from '../../services/auth/authService';

export const loginResident = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Missing required credentials' });
    return;
  }

  try {
    const authResult = await authenticateResident(email, password);

    if (!authResult) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    res.status(200).json(authResult);
  } catch (executionError) {
    res.status(500).json({ error: 'Internal server error encountered during authentication' });
  }
};
