import { IUseCase } from '../../interfaces/IUseCase';
import { ICartRepository } from '../../../domain/repositories/ICartRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { AppError } from '../../../shared/errors/errorHandler';

interface AddItemToCartInput {
  userId: number;
  productId: number;
  quantity?: number;
}

export class AddItemToCart implements IUseCase<AddItemToCartInput, void> {
  constructor(
    private cartRepo: ICartRepository,
    private productRepo: IProductRepository
  ) {}

  async execute(input: AddItemToCartInput): Promise<void> {
    const quantity = input.quantity || 1;
    if (quantity <= 0) throw new AppError('Quantity must be positive', 400);

    const product = await this.productRepo.findById(input.productId);
    if (!product || !product.isActive) {
      throw new AppError('Product not available', 404);
    }
    if (!product.hasStock(quantity)) {
      throw new AppError('Insufficient stock', 400);
    }

    await this.cartRepo.addItem(input.userId, product.id!, product.storeId, quantity);
  }
}
