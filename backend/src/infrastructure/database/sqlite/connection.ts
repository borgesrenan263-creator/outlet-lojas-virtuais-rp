import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { UserModel } from './models/UserModel';
import { StoreModel } from './models/StoreModel';
import { ProductModel } from './models/ProductModel';
import { OrderModel, SubOrderModel, SubOrderItemModel } from './models/OrderModel';
import { CartItemModel } from './models/CartModel';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_PATH || './outlet_rp.sqlite',
  synchronize: true,
  logging: false,
  entities: [UserModel, StoreModel, ProductModel, OrderModel, SubOrderModel, SubOrderItemModel, CartItemModel],
  migrations: [],
  subscribers: [],
});
