import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_nest_secret_key';
const EXPIRES_IN = '1d';

export interface UserJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token: string): UserJwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as UserJwtPayload;
  } catch (error) {
    return null;
  }
};
