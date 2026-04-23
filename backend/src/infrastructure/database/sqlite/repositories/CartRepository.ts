import { Repository } from 'typeorm';
import { AppDataSource } from '../connection';
import { CartItemModel } from '../models/CartModel';
import { CartItem } from '../../../../domain/entities/Cart';
import { ICartRepository } from '../../../../domain/repositories/ICartRepository';

export class CartRepository implements ICartRepository {
  private repo: Repository<CartItemModel>;

  constructor() {
    this.repo = AppDataSource.getRepository(CartItemModel);
  }

  private toDomain(model: CartItemModel): CartItem {
    return new CartItem(
      model.id,
      model.userId,
      model.productId,
      model.storeId,
      model.quantity,
      model.addedAt
    );
  }

  async findByUserId(userId: number): Promise<CartItem[]> {
    const models = await this.repo.find({ where: { userId } });
    return models.map(m => this.toDomain(m));
  }

  async addItem(userId: number, productId: number, storeId: number, quantity: number): Promise<CartItem> {
    const existing = await this.repo.findOne({ where: { userId, productId } });
    if (existing) {
      existing.quantity += quantity;
      const saved = await this.repo.save(existing);
      return this.toDomain(saved);
    }

    const model = this.repo.create({ userId, productId, storeId, quantity });
    const saved = await this.repo.save(model);
    return this.toDomain(saved);
  }

  async updateQuantity(cartItemId: number, quantity: number): Promise<CartItem | null> {
    const model = await this.repo.findOneBy({ id: cartItemId });
    if (!model) return null;
    model.quantity = quantity;
    const saved = await this.repo.save(model);
    return this.toDomain(saved);
  }

  async removeItem(cartItemId: number): Promise<void> {
    await this.repo.delete(cartItemId);
  }

  async clearCart(userId: number): Promise<void> {
    await this.repo.delete({ userId });
  }
}
