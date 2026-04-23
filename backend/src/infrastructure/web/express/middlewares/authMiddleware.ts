import { Request, Response, NextFunction } from 'express';
import { JwtTokenService } from '../../../auth/JwtTokenService';
import { AppError } from '../../../../shared/errors/errorHandler';

const tokenService = new JwtTokenService();

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new AppError('No token provided', 401);
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    throw new AppError('Token error', 401);
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    throw new AppError('Token malformatted', 401);
  }

  try {
    const payload = tokenService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};
