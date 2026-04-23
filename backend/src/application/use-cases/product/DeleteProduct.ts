import { IUseCase } from '../../interfaces/IUseCase';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { IStoreRepository } from '../../../domain/repositories/IStoreRepository';
import { AppError } from '../../../shared/errors/errorHandler';

export class DeleteProduct implements IUseCase<{ userId: number; productId: number }, void> {
  constructor(
    private productRepo: IProductRepository,
    private storeRepo: IStoreRepository
  ) {}

  async execute(input: { userId: number; productId: number }): Promise<void> {
    const store = await this.storeRepo.findByOwnerId(input.userId);
    if (!store) throw new AppError('Store not found', 404);

    const product = await this.productRepo.findById(input.productId);
    if (!product) throw new AppError('Product not found', 404);
    if (product.storeId !== store.id) throw new AppError('Unauthorized', 403);

    await this.productRepo.delete(product.id!);
  }
}
