import { IUseCase } from '../../interfaces/IUseCase';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { IStoreRepository } from '../../../domain/repositories/IStoreRepository';
import { Money } from '../../../domain/value-objects/Money';
import { AppError } from '../../../shared/errors/errorHandler';

export interface UpdateProductInput {
  userId: number;
  productId: number;
  name?: string;
  description?: string | null;
  price?: number;
  stockQuantity?: number;
  isActive?: boolean;
  images?: string[];
}

export interface UpdateProductOutput {
  id: number;
  name: string;
  price: number;
  isActive: boolean;
}

export class UpdateProduct implements IUseCase<UpdateProductInput, UpdateProductOutput> {
  constructor(
    private productRepo: IProductRepository,
    private storeRepo: IStoreRepository
  ) {}

  async execute(input: UpdateProductInput): Promise<UpdateProductOutput> {
    // 1. Buscar loja do usuário
    const store = await this.storeRepo.findByOwnerId(input.userId);
    if (!store) throw new AppError('Store not found', 404);

    // 2. Buscar produto
    const product = await this.productRepo.findById(input.productId);
    if (!product) throw new AppError('Product not found', 404);

    // 3. Verificar dono
    if (product.storeId !== store.id) {
      throw new AppError('Product does not belong to your store', 403);
    }

    // 4. Atualizar campos
    if (input.name !== undefined) product.name = input.name;
    if (input.description !== undefined) product.description = input.description ?? null;
    if (input.price !== undefined) product.changePrice(new Money(input.price));
    if (input.stockQuantity !== undefined) product.stockQuantity = input.stockQuantity;
    if (input.isActive !== undefined) product.isActive = input.isActive;
    if (input.images !== undefined) product.images = input.images;

    const updated = await this.productRepo.update(product);
    return {
      id: updated.id!,
      name: updated.name,
      price: updated.getPrice().toNumber(),
      isActive: updated.isActive,
    };
  }
}
