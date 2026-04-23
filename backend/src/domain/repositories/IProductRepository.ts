import { Product } from '../entities/Product';

export interface IProductRepository {
  findById(id: number): Promise<Product | null>;
  findByStoreId(storeId: number): Promise<Product[]>;
  create(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: number): Promise<void>;
}
