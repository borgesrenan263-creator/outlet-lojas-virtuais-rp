import { Request, Response, NextFunction } from 'express';
import { RegisterUser } from '../../../../application/use-cases/auth/RegisterUser';
import { LoginUser } from '../../../../application/use-cases/auth/LoginUser';
import { RefreshToken } from '../../../../application/use-cases/auth/RefreshToken';
import { logger } from '../../../../shared/logger';

export class AuthController {
  constructor(
    private registerUseCase: RegisterUser,
    private loginUseCase: LoginUser,
    private refreshTokenUseCase: RefreshToken
  ) {}

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name, email, password]
   *             properties:
   *               name: { type: string }
   *               email: { type: string, format: email }
   *               password: { type: string, minLength: 8 }
   *               phone: { type: string }
   *               role: { type: string, enum: [customer, seller] }
   *     responses:
   *       201:
   *         description: User created successfully
   *       409:
   *         description: Email already registered
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.registerUseCase.execute(req.body);
      logger.info(`User registered: ${result.email}`);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login with email and password
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email: { type: string, format: email }
   *               password: { type: string }
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user: { type: object }
   *                 accessToken: { type: string }
   *                 refreshToken: { type: string }
   *       401:
   *         description: Invalid credentials
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.loginUseCase.execute(req.body);
      logger.info(`User logged in: ${result.user.email}`);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/refresh:
   *   post:
   *     summary: Refresh access token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [refreshToken]
   *             properties:
   *               refreshToken: { type: string }
   *     responses:
   *       200:
   *         description: New access token
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken: { type: string }
   *       401:
   *         description: Invalid refresh token
   */
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.refreshTokenUseCase.execute(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
