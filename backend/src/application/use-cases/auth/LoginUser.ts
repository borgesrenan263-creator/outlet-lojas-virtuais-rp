import { IUseCase } from '../../interfaces/IUseCase';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { Email } from '../../../domain/value-objects/Email';
import { AppError } from '../../../shared/errors/errorHandler';
import { IAuthTokenService } from '../../../infrastructure/auth/JwtTokenService';

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserOutput {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export class LoginUser implements IUseCase<LoginUserInput, LoginUserOutput> {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: IAuthTokenService
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const email = new Email(input.email);
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValid = await user.validatePassword(input.password);
    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.id) {
      throw new AppError('User ID is missing', 500);
    }

    const payload = {
      userId: user.id,
      email: user.email.toString(),
      role: user.role.toString(),
    };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email.toString(),
        role: user.role.toString(),
      },
      accessToken,
      refreshToken,
    };
  }
}
