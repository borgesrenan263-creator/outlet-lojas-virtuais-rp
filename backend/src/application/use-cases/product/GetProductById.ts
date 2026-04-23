import { IUseCase } from '../../interfaces/IUseCase';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { AppError } from '../../../shared/errors/errorHandler';

export interface GetProductOutput {
  id: number;
  storeId: number;
  name: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  images: string[];
  isActive: boolean;
}

export class GetProductById implements IUseCase<number, GetProductOutput> {
  constructor(private productRepo: IProductRepository) {}

  async execute(productId: number): Promise<GetProductOutput> {
    const p = await this.productRepo.findById(productId);
    if (!p) throw new AppError('Product not found', 404);
    return {
      id: p.id!,
      storeId: p.storeId,
      name: p.name,
      description: p.description,
      price: p.getPrice().toNumber(),
      stockQuantity: p.stockQuantity,
      images: p.images,
      isActive: p.isActive,
    };
  }
}
