import { Address } from '../value-objects/Address';

export type OrderStatus = 'pending' | 'paid' | 'delivered' | 'cancelled';
export type SellerStatus = 'pending' | 'preparing' | 'shipped' | 'delivered';

export class SubOrderItem {
  constructor(
    public readonly productId: number,
    public quantity: number,
    public unitPrice: number
  ) {}
}

export class SubOrder {
  constructor(
    public readonly id: number | null,
    public readonly orderId: number | null,
    public readonly storeId: number,
    public subtotal: number,
    public shippingFee: number,
    public total: number,
    public sellerStatus: SellerStatus,
    public readonly items: SubOrderItem[] = []
  ) {}
}

export class Order {
  constructor(
    public readonly id: number | null,
    public readonly customerId: number,
    public readonly addressId: number,
    public totalAmount: number,
    public paymentMethod: string,
    public paymentStatus: OrderStatus,
    public gatewayTransactionId: string | null,
    public readonly subOrders: SubOrder[] = [],
    public readonly createdAt: Date = new Date()
  ) {}
}
