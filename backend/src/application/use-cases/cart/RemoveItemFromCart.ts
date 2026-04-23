import { IUseCase } from '../../interfaces/IUseCase';
import { ICartRepository } from '../../../domain/repositories/ICartRepository';
import { AppError } from '../../../shared/errors/errorHandler';

export class RemoveItemFromCart implements IUseCase<{ userId: number; cartItemId: number }, void> {
  constructor(private cartRepo: ICartRepository) {}

  async execute(input: { userId: number; cartItemId: number }): Promise<void> {
    const items = await this.cartRepo.findByUserId(input.userId);
    const item = items.find(i => i.id === input.cartItemId);
    if (!item) throw new AppError('Item not found in your cart', 404);
    await this.cartRepo.removeItem(input.cartItemId);
  }
}
