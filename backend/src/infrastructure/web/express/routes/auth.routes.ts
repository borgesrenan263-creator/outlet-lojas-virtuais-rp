import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../../../../shared/middlewares/validate';
import { registerSchema, loginSchema, refreshTokenSchema } from '../../../../shared/validation/authSchemas';
import { UserRepository } from '../../../database/sqlite/repositories/UserRepository';
import { JwtTokenService } from '../../../../infrastructure/auth/JwtTokenService';
import { RegisterUser } from '../../../../application/use-cases/auth/RegisterUser';
import { LoginUser } from '../../../../application/use-cases/auth/LoginUser';
import { RefreshToken } from '../../../../application/use-cases/auth/RefreshToken';

const router = Router();

// Dependencies
const userRepo = new UserRepository();
const tokenService = new JwtTokenService();
const registerUseCase = new RegisterUser(userRepo);
const loginUseCase = new LoginUser(userRepo, tokenService);
const refreshTokenUseCase = new RefreshToken(tokenService, userRepo);
const authController = new AuthController(registerUseCase, loginUseCase, refreshTokenUseCase);

router.post('/register', validate(registerSchema), authController.register.bind(authController));
router.post('/login', validate(loginSchema), authController.login.bind(authController));
router.post('/refresh', validate(refreshTokenSchema), authController.refresh.bind(authController));

export default router;
