import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserModel } from './UserModel';
import { ProductModel } from './ProductModel';

@Entity('stores')
export class StoreModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'owner_id', unique: true })
  ownerId!: number;

  @OneToOne(() => UserModel)
  @JoinColumn({ name: 'owner_id' })
  owner!: UserModel;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ nullable: true, type: 'text' })
  description!: string | null;

  @Column({ name: 'logo_url', nullable: true, type: 'text' })
  logoUrl!: string | null;

  @Column({ name: 'banner_url', nullable: true, type: 'text' })
  bannerUrl!: string | null;

  @Column({ name: 'is_open', default: true })
  isOpen!: boolean;

  @Column({ name: 'pix_key', nullable: true, type: 'text' })
  pixKey!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => ProductModel, product => product.store)
  products?: ProductModel[];
}
