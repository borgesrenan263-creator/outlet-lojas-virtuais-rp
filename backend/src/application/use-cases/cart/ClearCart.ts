import { IUseCase } from '../../interfaces/IUseCase';
import { ICartRepository } from '../../../domain/repositories/ICartRepository';

export class ClearCart implements IUseCase<number, void> {
  constructor(private cartRepo: ICartRepository) {}

  async execute(userId: number): Promise<void> {
    await this.cartRepo.clearCart(userId);
  }
}
