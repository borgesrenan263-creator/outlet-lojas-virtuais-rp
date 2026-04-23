import { IUseCase } from '../../interfaces/IUseCase';
import { IStoreRepository } from '../../../domain/repositories/IStoreRepository';
import { AppError } from '../../../shared/errors/errorHandler';

export interface UpdateStoreInput {
  userId: number; // quem está tentando atualizar (dono ou admin)
  storeId: number;
  name?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  isOpen?: boolean;
  pixKey?: string;
}

export interface UpdateStoreOutput {
  id: number;
  name: string;
  slug: string;
  isOpen: boolean;
}

export class UpdateStore implements IUseCase<UpdateStoreInput, UpdateStoreOutput> {
  constructor(private storeRepository: IStoreRepository) {}

  async execute(input: UpdateStoreInput): Promise<UpdateStoreOutput> {
    const store = await this.storeRepository.findById(input.storeId);
    if (!store) {
      throw new AppError('Store not found', 404);
    }

    // Apenas dono ou admin podem editar (admin check fica no middleware, mas verificamos owner)
    if (store.ownerId !== input.userId) {
      throw new AppError('You can only update your own store', 403);
    }

    if (input.name !== undefined) store.name = input.name;
    if (input.description !== undefined) store.description = input.description ?? null;
    if (input.logoUrl !== undefined) store.logoUrl = input.logoUrl ?? null;
    if (input.bannerUrl !== undefined) store.bannerUrl = input.bannerUrl ?? null;
    if (input.isOpen !== undefined) store.isOpen = input.isOpen;
    if (input.pixKey !== undefined) store.pixKey = input.pixKey ?? null;

    const updated = await this.storeRepository.update(store);
    return {
      id: updated.id!,
      name: updated.name,
      slug: updated.slug,
      isOpen: updated.isOpen,
    };
  }
}
