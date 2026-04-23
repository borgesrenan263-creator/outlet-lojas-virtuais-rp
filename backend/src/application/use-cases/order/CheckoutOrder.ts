import { IUseCase } from '../../interfaces/IUseCase';
import { ICartRepository } from '../../../domain/repositories/ICartRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { IStoreRepository } from '../../../domain/repositories/IStoreRepository';
import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';
import { IPaymentGateway } from '../../../infrastructure/payment/MockPaymentGateway';
import { Order, SubOrder, SubOrderItem } from '../../../domain/entities/Order';
import { AppError } from '../../../shared/errors/errorHandler';

interface CheckoutInput {
  userId: number;
  addressId: number;
  paymentMethod: string; // 'pix', 'credit_card', etc.
}

interface CheckoutOutput {
  orderId: number;
  totalAmount: number;
  paymentStatus: string;
  transactionId: string;
  subOrders: {
    storeId: number;
    subtotal: number;
    shippingFee: number;
    total: number;
  }[];
}

export class CheckoutOrder implements IUseCase<CheckoutInput, CheckoutOutput> {
  constructor(
    private cartRepo: ICartRepository,
    private productRepo: IProductRepository,
    private storeRepo: IStoreRepository,
    private orderRepo: IOrderRepository,
    private paymentGateway: IPaymentGateway
  ) {}

  async execute(input: CheckoutInput): Promise<CheckoutOutput> {
    const cartItems = await this.cartRepo.findByUserId(input.userId);
    if (cartItems.length === 0) throw new AppError('Cart is empty', 400);

    // Agrupa por loja
    const byStore = new Map<number, { productId: number; quantity: number; price: number }[]>();
    for (const item of cartItems) {
      const product = await this.productRepo.findById(item.productId);
      if (!product || !product.isActive) throw new AppError(`Product "${item.productId}" unavailable`, 400);
      if (!product.hasStock(item.quantity)) throw new AppError(`Insufficient stock for product "${product.name}"`, 400);

      const items = byStore.get(item.storeId) || [];
      items.push({ productId: product.id!, quantity: item.quantity, price: product.getPrice().toNumber() });
      byStore.set(item.storeId, items);
    }

    // Cria suborders e calcula total
    const subOrders: SubOrder[] = [];
    let totalAmount = 0;

    for (const [storeId, items] of byStore) {
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const shippingFee = 0; // frete mockado (futuro: consultar shipping_rules)
      const total = subtotal + shippingFee;
      const subItems = items.map(i => new SubOrderItem(i.productId, i.quantity, i.price));
      subOrders.push(new SubOrder(null, null, storeId, subtotal, shippingFee, total, 'pending', subItems));
      totalAmount += total;
    }

    // Processa pagamento mock
    const paymentResult = await this.paymentGateway.processPayment(totalAmount, input.paymentMethod);
    if (!paymentResult.success) throw new AppError('Payment failed', 402);

    const order = new Order(
      null,
      input.userId,
      input.addressId,
      totalAmount,
      input.paymentMethod,
      'paid',
      paymentResult.transactionId,
      subOrders
    );

    const saved = await this.orderRepo.create(order);
    if (!saved.id) throw new AppError('Failed to create order', 500);

    // Limpa carrinho
    await this.cartRepo.clearCart(input.userId);

    return {
      orderId: saved.id,
      totalAmount: totalAmount,
      paymentStatus: 'paid',
      transactionId: paymentResult.transactionId,
      subOrders: subOrders.map(s => ({ storeId: s.storeId, subtotal: s.subtotal, shippingFee: s.shippingFee, total: s.total })),
    };
  }
}
