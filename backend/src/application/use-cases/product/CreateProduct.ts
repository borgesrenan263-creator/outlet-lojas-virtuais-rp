import { IUseCase } from '../../interfaces/IUseCase';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { IStoreRepository } from '../../../domain/repositories/IStoreRepository';
import { Product } from '../../../domain/entities/Product';
import { Money } from '../../../domain/value-objects/Money';
import { AppError } from '../../../shared/errors/errorHandler';

export interface CreateProductInput {
  userId: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  images?: string[];
}

export interface CreateProductOutput {
  id: number;
  storeId: number;
  name: string;
  price: number;
  stockQuantity: number;
}

export class CreateProduct implements IUseCase<CreateProductInput, CreateProductOutput> {
  constructor(
    private productRepo: IProductRepository,
    private storeRepo: IStoreRepository
  ) {}

  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    // 1. Buscar loja do usuário
    const store = await this.storeRepo.findByOwnerId(input.userId);
    if (!store || !store.isOpen) {
      throw new AppError('Store not found or closed', 404);
    }

    // 2. Validar preço e estoque
    if (input.price <= 0) {
      throw new AppError('Price must be greater than zero', 400);
    }
    if (input.stockQuantity < 0) {
      throw new AppError('Stock cannot be negative', 400);
    }

    const product = new Product(
      null,
      store.id!,
      input.name,
      input.description || null,
      new Money(input.price),
      input.stockQuantity,
      true,
      input.images || []
    );

    const saved = await this.productRepo.create(product);
    if (!saved.id) throw new AppError('Failed to create product', 500);

    return {
      id: saved.id,
      storeId: saved.storeId,
      name: saved.name,
      price: saved.getPrice().toNumber(),
      stockQuantity: saved.stockQuantity,
    };
  }
}
