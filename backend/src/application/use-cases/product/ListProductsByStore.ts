import { IUseCase } from '../../interfaces/IUseCase';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';

export interface ProductListItem {
  id: number;
  name: string;
  price: number;
  stock: number;
  images: string[];
}

export class ListProductsByStore implements IUseCase<number, ProductListItem[]> {
  constructor(private productRepo: IProductRepository) {}

  async execute(storeId: number): Promise<ProductListItem[]> {
    const products = await this.productRepo.findByStoreId(storeId);
    return products
      .filter(p => p.isActive)
      .map(p => ({
        id: p.id!,
        name: p.name,
        price: p.getPrice().toNumber(),
        stock: p.stockQuantity,
        images: p.images,
      }));
  }
}
