import { IUseCase } from '../../interfaces/IUseCase';
import { IStoreRepository } from '../../../domain/repositories/IStoreRepository';
import { AppError } from '../../../shared/errors/errorHandler';

export interface GetStoreBySlugOutput {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  isOpen: boolean;
  pixKey: string | null;
  createdAt: Date;
}

export class GetStoreBySlug implements IUseCase<string, GetStoreBySlugOutput> {
  constructor(private storeRepository: IStoreRepository) {}

  async execute(slug: string): Promise<GetStoreBySlugOutput> {
    const store = await this.storeRepository.findBySlug(slug);
    if (!store) {
      throw new AppError('Store not found', 404);
    }

    return {
      id: store.id!,
      name: store.name,
      slug: store.slug,
      description: store.description,
      logoUrl: store.logoUrl,
      bannerUrl: store.bannerUrl,
      isOpen: store.isOpen,
      pixKey: store.pixKey,
      createdAt: store.createdAt,
    };
  }
}
