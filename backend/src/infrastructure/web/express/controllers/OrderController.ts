import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { CheckoutOrder } from '../../../../application/use-cases/order/CheckoutOrder';
import { GetCustomerOrders } from '../../../../application/use-cases/order/GetCustomerOrders';
import { GetOrderById } from '../../../../application/use-cases/order/GetOrderById';
import { logger } from '../../../../shared/logger';

export class OrderController {
  constructor(
    private checkoutUC: CheckoutOrder,
    private getOrdersUC: GetCustomerOrders,
    private getOrderByIdUC: GetOrderById
  ) {}

  async checkout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await this.checkoutUC.execute({ userId, ...req.body });
      logger.info(`Order created: id=${result.orderId} for user ${userId}`);
      res.status(201).json(result);
    } catch (e) { next(e); }
  }

  async listMyOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const orders = await this.getOrdersUC.execute(userId);
      res.json(orders);
    } catch (e) { next(e); }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const order = await this.getOrderByIdUC.execute(id);
      res.json(order);
    } catch (e) { next(e); }
  }
}
