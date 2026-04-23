import { CartItem } from '../entities/Cart';

export interface ICartRepository {
  findByUserId(userId: number): Promise<CartItem[]>;
  addItem(userId: number, productId: number, storeId: number, quantity: number): Promise<CartItem>;
  updateQuantity(cartItemId: number, quantity: number): Promise<CartItem | null>;
  removeItem(cartItemId: number): Promise<void>;
  clearCart(userId: number): Promise<void>;
}
