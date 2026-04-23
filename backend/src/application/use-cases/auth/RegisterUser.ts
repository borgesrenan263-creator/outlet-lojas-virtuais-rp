import { IUseCase } from '../../interfaces/IUseCase';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { Email } from '../../../domain/value-objects/Email';
import { Password } from '../../../domain/value-objects/Password';
import { Role, UserRole } from '../../../domain/value-objects/UserRole';
import { AppError } from '../../../shared/errors/errorHandler';

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

export interface RegisterUserOutput {
  id: number;
  name: string;
  email: string;
  role: string;
}

export class RegisterUser implements IUseCase<RegisterUserInput, RegisterUserOutput> {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const email = new Email(input.email);
    
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const password = await Password.create(input.password);
    const role = new Role(input.role || UserRole.CUSTOMER);

    const user = new User(
      null,
      email,
      password,
      input.name,
      input.phone || null,
      role
    );

    const saved = await this.userRepository.create(user);
    if (!saved.id) {
      throw new AppError('Failed to create user', 500);
    }

    return {
      id: saved.id,
      name: saved.name,
      email: saved.email.toString(),
      role: saved.role.toString(),
    };
  }
}
