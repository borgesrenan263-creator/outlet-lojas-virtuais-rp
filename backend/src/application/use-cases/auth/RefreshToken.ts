import { IUseCase } from '../../interfaces/IUseCase';
import { IAuthTokenService } from '../../../infrastructure/auth/JwtTokenService';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AppError } from '../../../shared/errors/errorHandler';

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface RefreshTokenOutput {
  accessToken: string;
}

export class RefreshToken implements IUseCase<RefreshTokenInput, RefreshTokenOutput> {
  constructor(
    private tokenService: IAuthTokenService,
    private userRepository: IUserRepository
  ) {}

  async execute(input: RefreshTokenInput): Promise<RefreshTokenOutput> {
    const payload = this.tokenService.verifyRefreshToken(input.refreshToken);
    
    // Verificar se usuário ainda existe e está ativo
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const newAccessToken = this.tokenService.generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    return { accessToken: newAccessToken };
  }
}
