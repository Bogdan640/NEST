import { Request, Response, NextFunction } from 'express';
import { verifyToken, UserJwtPayload } from '../utils/jwtUtils';
import { ROLES } from '../config/constants';

export interface AuthenticatedRequest extends Request {
  user?: UserJwtPayload;
}

export const requireAuthentication = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized credentials' });
    return;
  }

  const extractedToken = authorizationHeader.split(' ')[1];
  
  if (!extractedToken) {
    res.status(401).json({ error: 'Unauthorized credentials' });
    return;
  }

  const decodedPayload = verifyToken(extractedToken);
  
  if (!decodedPayload) {
    res.status(401).json({ error: 'Expired or invalid credentials' });
    return;
  }

  req.user = decodedPayload;
  next();
};

export const requireVerified = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  if (!req.user.isVerified) {
    res.status(403).json({ error: 'Account not yet verified by block admin' });
    return;
  }

  next();
};

export const requireAdminRole = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  if (req.user.role !== ROLES.ADMIN) {
    res.status(403).json({ error: 'Insufficient administrative privileges' });
    return;
  }

  next();
};
