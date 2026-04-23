import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { CreateProduct } from '../../../../application/use-cases/product/CreateProduct';
import { UpdateProduct } from '../../../../application/use-cases/product/UpdateProduct';
import { GetProductById } from '../../../../application/use-cases/product/GetProductById';
import { ListProductsByStore } from '../../../../application/use-cases/product/ListProductsByStore';
import { DeleteProduct } from '../../../../application/use-cases/product/DeleteProduct';
import { logger } from '../../../../shared/logger';

export class ProductController {
  constructor(
    private createUC: CreateProduct,
    private updateUC: UpdateProduct,
    private getByIdUC: GetProductById,
    private listByStoreUC: ListProductsByStore,
    private deleteUC: DeleteProduct
  ) {}

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await this.createUC.execute({ userId, ...req.body });
      logger.info(`Product created: id=${result.id} by user ${userId}`);
      res.status(201).json(result);
    } catch (e) { next(e); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const productId = parseInt(req.params.id);
      const result = await this.updateUC.execute({ userId, productId, ...req.body });
      res.json(result);
    } catch (e) { next(e); }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.getByIdUC.execute(id);
      res.json(result);
    } catch (e) { next(e); }
  }

  async listByStore(req: Request, res: Response, next: NextFunction) {
    try {
      const storeId = parseInt(req.params.storeId);
      const result = await this.listByStoreUC.execute(storeId);
      res.json(result);
    } catch (e) { next(e); }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const productId = parseInt(req.params.id);
      await this.deleteUC.execute({ userId, productId });
      res.status(204).send();
    } catch (e) { next(e); }
  }
}
