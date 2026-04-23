import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { AddItemToCart } from '../../../../application/use-cases/cart/AddItemToCart';
import { GetCart } from '../../../../application/use-cases/cart/GetCart';
import { RemoveItemFromCart } from '../../../../application/use-cases/cart/RemoveItemFromCart';
import { ClearCart } from '../../../../application/use-cases/cart/ClearCart';
import { logger } from '../../../../shared/logger';

export class CartController {
  constructor(
    private addItemUC: AddItemToCart,
    private getCartUC: GetCart,
    private removeItemUC: RemoveItemFromCart,
    private clearCartUC: ClearCart
  ) {}

  async addItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      await this.addItemUC.execute({ userId, ...req.body });
      logger.info(`Item added to cart for user ${userId}`);
      res.status(201).json({ message: 'Item added to cart' });
    } catch (e) { next(e); }
  }

  async getCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const cart = await this.getCartUC.execute(userId);
      res.json(cart);
    } catch (e) { next(e); }
  }

  async removeItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const cartItemId = parseInt(req.params.id);
      await this.removeItemUC.execute({ userId, cartItemId });
      res.status(204).send();
    } catch (e) { next(e); }
  }

  async clearCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      await this.clearCartUC.execute(userId);
      res.status(204).send();
    } catch (e) { next(e); }
  }
}
