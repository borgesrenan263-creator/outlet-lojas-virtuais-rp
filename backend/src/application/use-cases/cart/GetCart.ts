import { IUseCase } from '../../interfaces/IUseCase';
import { ICartRepository } from '../../../domain/repositories/ICartRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { IStoreRepository } from '../../../domain/repositories/IStoreRepository';

interface CartItemDetail {
  cartItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string | null;
}

interface StoreCartGroup {
  storeId: number;
  storeName: string;
  items: CartItemDetail[];
  subtotal: number;
}

export class GetCart implements IUseCase<number, StoreCartGroup[]> {
  constructor(
    private cartRepo: ICartRepository,
    private productRepo: IProductRepository,
    private storeRepo: IStoreRepository
  ) {}

  async execute(userId: number): Promise<StoreCartGroup[]> {
    const cartItems = await this.cartRepo.findByUserId(userId);
    if (cartItems.length === 0) return [];

    const grouped = new Map<number, CartItemDetail[]>();

    for (const item of cartItems) {
      const product = await this.productRepo.findById(item.productId);
      if (!product) continue;

      const detail: CartItemDetail = {
        cartItemId: item.id!,
        productId: product.id!,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.getPrice().toNumber(),
        totalPrice: product.getPrice().multiply(item.quantity).toNumber(),
        image: product.images.length > 0 ? product.images[0] : null,
      };

      const group = grouped.get(item.storeId) || [];
      group.push(detail);
      grouped.set(item.storeId, group);
    }

    const result: StoreCartGroup[] = [];
    for (const [storeId, items] of grouped) {
      const store = await this.storeRepo.findById(storeId);
      result.push({
        storeId,
        storeName: store ? store.name : 'Loja desconhecida',
        items,
        subtotal: items.reduce((sum, i) => sum + i.totalPrice, 0),
      });
    }

    return result;
  }
}
