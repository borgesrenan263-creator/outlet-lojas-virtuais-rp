import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserModel } from './UserModel';
import { StoreModel } from './StoreModel';

@Entity('orders')
export class OrderModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'customer_id' })
  customerId!: number;

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'customer_id' })
  customer!: UserModel;

  @Column({ name: 'address_id' })
  addressId!: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ name: 'payment_method' })
  paymentMethod!: string;

  @Column({ name: 'payment_status', default: 'pending' })
  paymentStatus!: string;

  @Column({ name: 'gateway_transaction_id', nullable: true })
  gatewayTransactionId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => SubOrderModel, subOrder => subOrder.order)
  subOrders?: SubOrderModel[];
}

@Entity('sub_orders')
export class SubOrderModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'order_id' })
  orderId!: number;

  @ManyToOne(() => OrderModel)
  @JoinColumn({ name: 'order_id' })
  order!: OrderModel;

  @Column({ name: 'store_id' })
  storeId!: number;

  @ManyToOne(() => StoreModel)
  @JoinColumn({ name: 'store_id' })
  store!: StoreModel;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal!: number;

  @Column({ name: 'shipping_fee', type: 'decimal', precision: 10, scale: 2 })
  shippingFee!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total!: number;

  @Column({ name: 'seller_status', default: 'pending' })
  sellerStatus!: string;

  @Column({ name: 'seller_account_id', nullable: true })
  sellerAccountId!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  commission!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => SubOrderItemModel, item => item.subOrder)
  items?: SubOrderItemModel[];
}

@Entity('sub_order_items')
export class SubOrderItemModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'sub_order_id' })
  subOrderId!: number;

  @ManyToOne(() => SubOrderModel)
  @JoinColumn({ name: 'sub_order_id' })
  subOrder!: SubOrderModel;

  @Column({ name: 'product_id' })
  productId!: number;

  @Column()
  quantity!: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: number;
}
