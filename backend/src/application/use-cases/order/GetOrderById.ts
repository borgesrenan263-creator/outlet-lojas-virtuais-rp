import { IUseCase } from '../../interfaces/IUseCase';
import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';
import { AppError } from '../../../shared/errors/errorHandler';

interface OrderDetail {
  orderId: number;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  transactionId: string | null;
  createdAt: Date;
  subOrders: {
    subOrderId: number;
    storeId: number;
    subtotal: number;
    shippingFee: number;
    total: number;
    sellerStatus: string;
    items: {
      productId: number;
      quantity: number;
      unitPrice: number;
    }[];
  }[];
}

export class GetOrderById implements IUseCase<number, OrderDetail> {
  constructor(private orderRepo: IOrderRepository) {}

  async execute(orderId: number): Promise<OrderDetail> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);
    return {
      orderId: order.id!,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      transactionId: order.gatewayTransactionId,
      createdAt: order.createdAt,
      subOrders: order.subOrders.map(sub => ({
        subOrderId: sub.id!,
        storeId: sub.storeId,
        subtotal: sub.subtotal,
        shippingFee: sub.shippingFee,
        total: sub.total,
        sellerStatus: sub.sellerStatus,
        items: sub.items.map(i => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice })),
      })),
    };
  }
}
