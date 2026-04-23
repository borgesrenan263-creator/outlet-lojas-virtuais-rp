import { Repository } from 'typeorm';
import { AppDataSource } from '../connection';
import { OrderModel, SubOrderModel, SubOrderItemModel } from '../models/OrderModel';
import { Order, SubOrder, SubOrderItem } from '../../../../domain/entities/Order';
import { IOrderRepository } from '../../../../domain/repositories/IOrderRepository';

export class OrderRepository implements IOrderRepository {
  private orderRepo: Repository<OrderModel>;
  private subRepo: Repository<SubOrderModel>;
  private itemRepo: Repository<SubOrderItemModel>;

  constructor() {
    this.orderRepo = AppDataSource.getRepository(OrderModel);
    this.subRepo = AppDataSource.getRepository(SubOrderModel);
    this.itemRepo = AppDataSource.getRepository(SubOrderItemModel);
  }

  private subToDomain(model: SubOrderModel, items: SubOrderItemModel[]): SubOrder {
    return new SubOrder(
      model.id,
      model.orderId,
      model.storeId,
      Number(model.subtotal),
      Number(model.shippingFee),
      Number(model.total),
      model.sellerStatus as any,
      items.map(i => new SubOrderItem(i.productId, i.quantity, Number(i.unitPrice)))
    );
  }

  private orderToDomain(order: OrderModel, subs: SubOrderModel[], itemsMap: Map<number, SubOrderItemModel[]>): Order {
    const subOrders = subs.map(sub => {
      const items = itemsMap.get(sub.id) || [];
      return this.subToDomain(sub, items);
    });
    return new Order(
      order.id,
      order.customerId,
      order.addressId,
      Number(order.totalAmount),
      order.paymentMethod,
      order.paymentStatus as any,
      order.gatewayTransactionId ?? null,
      subOrders,
      order.createdAt
    );
  }

  async findById(id: number): Promise<Order | null> {
    const order = await this.orderRepo.findOneBy({ id });
    if (!order) return null;
    const subs = await this.subRepo.find({ where: { orderId: id } });
    const itemsMap = new Map<number, SubOrderItemModel[]>();
    for (const sub of subs) {
      const items = await this.itemRepo.find({ where: { subOrderId: sub.id } });
      itemsMap.set(sub.id, items);
    }
    return this.orderToDomain(order, subs, itemsMap);
  }

  async findByCustomerId(customerId: number): Promise<Order[]> {
    const orders = await this.orderRepo.find({ where: { customerId }, order: { createdAt: 'DESC' } });
    const result: Order[] = [];
    for (const order of orders) {
      const full = await this.findById(order.id);
      if (full) result.push(full);
    }
    return result;
  }

  async findByStoreId(storeId: number): Promise<SubOrder[]> {
    const subs = await this.subRepo.find({ where: { storeId } });
    const result: SubOrder[] = [];
    for (const sub of subs) {
      const items = await this.itemRepo.find({ where: { subOrderId: sub.id } });
      result.push(this.subToDomain(sub, items));
    }
    return result;
  }

  async create(order: Order): Promise<Order> {
    const orderModel = this.orderRepo.create({
      customerId: order.customerId,
      addressId: order.addressId,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      gatewayTransactionId: order.gatewayTransactionId ?? undefined,
    });
    const savedOrder = await this.orderRepo.save(orderModel);

    for (const sub of order.subOrders) {
      const subModel = this.subRepo.create({
        orderId: savedOrder.id,
        storeId: sub.storeId,
        subtotal: sub.subtotal,
        shippingFee: sub.shippingFee,
        total: sub.total,
        sellerStatus: sub.sellerStatus,
      });
      const savedSub = await this.subRepo.save(subModel);
      for (const item of sub.items) {
        const itemModel = this.itemRepo.create({
          subOrderId: savedSub.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        });
        await this.itemRepo.save(itemModel);
      }
    }

    const created = await this.findById(savedOrder.id);
    if (!created) throw new Error('Failed to retrieve created order');
    return created;
  }

  async updatePaymentStatus(orderId: number, status: string, transactionId: string): Promise<void> {
    await this.orderRepo.update(orderId, { paymentStatus: status, gatewayTransactionId: transactionId });
  }

  async updateSubOrderStatus(subOrderId: number, status: string): Promise<void> {
    await this.subRepo.update(subOrderId, { sellerStatus: status });
  }
}
