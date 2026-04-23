import { Request, Response, NextFunction } from 'express';
import { CreateStore } from '../../../../application/use-cases/store/CreateStore';
import { UpdateStore } from '../../../../application/use-cases/store/UpdateStore';
import { GetStoreBySlug } from '../../../../application/use-cases/store/GetStoreBySlug';
import { ListOpenStores } from '../../../../application/use-cases/store/ListOpenStores';
import { AuthRequest } from '../middlewares/authMiddleware';
import { logger } from '../../../../shared/logger';

export class StoreController {
  constructor(
    private createStoreUseCase: CreateStore,
    private updateStoreUseCase: UpdateStore,
    private getStoreBySlugUseCase: GetStoreBySlug,
    private listOpenStoresUseCase: ListOpenStores
  ) {}

  /**
   * @swagger
   * /api/stores:
   *   post:
   *     summary: Create a new store (seller only)
   *     tags: [Stores]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name, slug]
   *             properties:
   *               name: { type: string }
   *               slug: { type: string, pattern: '^[a-z0-9-]+$' }
   *               description: { type: string }
   *               logoUrl: { type: string, format: uri }
   *               bannerUrl: { type: string, format: uri }
   *               pixKey: { type: string }
   *     responses:
   *       201:
   *         description: Store created successfully
   *       403:
   *         description: User is not a seller or already has a store
   */
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await this.createStoreUseCase.execute({ ownerId: userId, ...req.body });
      logger.info(`Store created: ${result.slug} by user ${userId}`);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/stores/{id}:
   *   put:
   *     summary: Update a store (owner only)
   *     tags: [Stores]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: integer }
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name: { type: string }
   *               description: { type: string, nullable: true }
   *               logoUrl: { type: string, format: uri, nullable: true }
   *               bannerUrl: { type: string, format: uri, nullable: true }
   *               isOpen: { type: boolean }
   *               pixKey: { type: string, nullable: true }
   *     responses:
   *       200:
   *         description: Store updated
   */
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const storeId = parseInt(req.params.id);
      const result = await this.updateStoreUseCase.execute({ userId, storeId, ...req.body });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/stores/slug/{slug}:
   *   get:
   *     summary: Get store by slug (public)
   *     tags: [Stores]
   *     parameters:
   *       - in: path
   *         name: slug
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Store details
   */
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.getStoreBySlugUseCase.execute(req.params.slug);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/stores/open:
   *   get:
   *     summary: List all open stores (public)
   *     tags: [Stores]
   *     responses:
   *       200:
   *         description: List of open stores
   */
  async listOpen(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.listOpenStoresUseCase.execute();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
