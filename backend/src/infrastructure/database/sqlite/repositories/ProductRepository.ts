import { Repository } from 'typeorm';
import { AppDataSource } from '../connection';
import { ProductModel } from '../models/ProductModel';
import { Product } from '../../../../domain/entities/Product';
import { Money } from '../../../../domain/value-objects/Money';
import { IProductRepository } from '../../../../domain/repositories/IProductRepository';

export class ProductRepository implements IProductRepository {
  private repo: Repository<ProductModel>;

  constructor() {
    this.repo = AppDataSource.getRepository(ProductModel);
  }

  private toDomain(model: ProductModel): Product {
    return new Product(
      model.id,
      model.storeId,
      model.name,
      model.description,
      new Money(model.price),
      model.stockQuantity,
      model.isActive,
      model.images || [],
      null,
      model.createdAt
    );
  }

  async findById(id: number): Promise<Product | null> {
    const model = await this.repo.findOneBy({ id });
    return model ? this.toDomain(model) : null;
  }

  async findByStoreId(storeId: number): Promise<Product[]> {
    const models = await this.repo.find({ where: { storeId } });
    return models.map(m => this.toDomain(m));
  }

  async create(product: Product): Promise<Product> {
    const model = this.repo.create({
      storeId: product.storeId,
      name: product.name,
      description: product.description ?? undefined,
      price: product.getPrice().toNumber(),
      stockQuantity: product.stockQuantity,
      isActive: product.isActive,
      images: product.images,
    });
    const saved = await this.repo.save(model);
    return this.toDomain(saved);
  }

  async update(product: Product): Promise<Product> {
    await this.repo.update(product.id!, {
      name: product.name,
      description: product.description ?? undefined,
      price: product.getPrice().toNumber(),
      stockQuantity: product.stockQuantity,
      isActive: product.isActive,
      images: product.images,
    });
    const updated = await this.findById(product.id!);
    if (!updated) throw new Error('Product not found after update');
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
