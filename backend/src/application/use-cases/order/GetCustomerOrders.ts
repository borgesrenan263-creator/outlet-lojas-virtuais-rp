import { IUseCase } from '../../interfaces/IUseCase';
import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';
import { Order } from '../../../domain/entities/Order';

interface OrderSummary {
  orderId: number;
  totalAmount: number;
  paymentStatus: string;
  createdAt: Date;
  subOrders: { storeId: number; total: number; status: string }[];
}

export class GetCustomerOrders implements IUseCase<number, OrderSummary[]> {
  constructor(private orderRepo: IOrderRepository) {}

  async execute(userId: number): Promise<OrderSummary[]> {
    const orders = await this.orderRepo.findByCustomerId(userId);
    return orders.map(order => ({
      orderId: order.id!,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      subOrders: order.subOrders.map(sub => ({
        storeId: sub.storeId,
        total: sub.total,
        status: sub.sellerStatus,
      })),
    }));
  }
}
