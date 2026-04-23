import { IUseCase } from '../../interfaces/IUseCase';
import { IStoreRepository } from '../../../domain/repositories/IStoreRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { Store } from '../../../domain/entities/Store';
import { AppError } from '../../../shared/errors/errorHandler';

export interface CreateStoreInput {
  ownerId: number;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  pixKey?: string;
}

export interface CreateStoreOutput {
  id: number;
  name: string;
  slug: string;
  isOpen: boolean;
}

export class CreateStore implements IUseCase<CreateStoreInput, CreateStoreOutput> {
  constructor(
    private storeRepository: IStoreRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(input: CreateStoreInput): Promise<CreateStoreOutput> {
    // Verificar se o usuário existe e é seller
    const user = await this.userRepository.findById(input.ownerId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    if (!user.isSeller()) {
      throw new AppError('Only sellers can create a store', 403);
    }

    // Verificar se já tem loja
    const existing = await this.storeRepository.findByOwnerId(input.ownerId);
    if (existing) {
      throw new AppError('User already has a store', 409);
    }

    // Verificar slug único
    const slugExists = await this.storeRepository.findBySlug(input.slug);
    if (slugExists) {
      throw new AppError('Slug already in use', 409);
    }

    const store = new Store(
      null,
      input.ownerId,
      input.name,
      input.slug,
      input.description || null,
      input.logoUrl || null,
      input.bannerUrl || null,
      true, // inicia aberta
      input.pixKey || null
    );

    const saved = await this.storeRepository.create(store);
    if (!saved.id) {
      throw new AppError('Failed to create store', 500);
    }

    return {
      id: saved.id,
      name: saved.name,
      slug: saved.slug,
      isOpen: saved.isOpen,
    };
  }
}
