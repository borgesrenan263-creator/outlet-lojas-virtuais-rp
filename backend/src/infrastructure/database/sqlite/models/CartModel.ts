import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserModel } from './UserModel';
import { ProductModel } from './ProductModel';
import { StoreModel } from './StoreModel';

@Entity('cart_items')
export class CartItemModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'user_id' })
  user!: UserModel;

  @Column({ name: 'product_id' })
  productId!: number;

  @ManyToOne(() => ProductModel)
  @JoinColumn({ name: 'product_id' })
  product!: ProductModel;

  @Column({ name: 'store_id' })
  storeId!: number;

  @ManyToOne(() => StoreModel)
  @JoinColumn({ name: 'store_id' })
  store!: StoreModel;

  @Column({ default: 1 })
  quantity!: number;

  @CreateDateColumn({ name: 'added_at' })
  addedAt!: Date;
}
