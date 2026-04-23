import { Order, SubOrder } from '../entities/Order';

export interface IOrderRepository {
  findById(id: number): Promise<Order | null>;
  findByCustomerId(customerId: number): Promise<Order[]>;
  findByStoreId(storeId: number): Promise<SubOrder[]>;
  create(order: Order): Promise<Order>;
  updatePaymentStatus(orderId: number, status: string, transactionId: string): Promise<void>;
  updateSubOrderStatus(subOrderId: number, status: string): Promise<void>;
}
