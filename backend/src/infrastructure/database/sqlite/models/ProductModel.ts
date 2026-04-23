import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { StoreModel } from './StoreModel';

@Entity('products')
export class ProductModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'store_id' })
  storeId!: number;

  @ManyToOne(() => StoreModel)
  @JoinColumn({ name: 'store_id' })
  store!: StoreModel;

  @Column()
  name!: string;

  @Column({ nullable: true, type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ name: 'stock_quantity', default: 0 })
  stockQuantity!: number;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ type: 'simple-json', nullable: true })
  images!: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
