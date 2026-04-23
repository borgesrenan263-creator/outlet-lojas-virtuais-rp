import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { validate } from '../../../../shared/middlewares/validate';
import { createProductSchema, updateProductSchema } from '../../../../shared/validation/productSchemas';
import { ProductRepository } from '../../../database/sqlite/repositories/ProductRepository';
import { StoreRepository } from '../../../database/sqlite/repositories/StoreRepository';
import { CreateProduct } from '../../../../application/use-cases/product/CreateProduct';
import { UpdateProduct } from '../../../../application/use-cases/product/UpdateProduct';
import { GetProductById } from '../../../../application/use-cases/product/GetProductById';
import { ListProductsByStore } from '../../../../application/use-cases/product/ListProductsByStore';
import { DeleteProduct } from '../../../../application/use-cases/product/DeleteProduct';

const router = Router();

const productRepo = new ProductRepository();
const storeRepo = new StoreRepository();

const productController = new ProductController(
  new CreateProduct(productRepo, storeRepo),
  new UpdateProduct(productRepo, storeRepo),
  new GetProductById(productRepo),
  new ListProductsByStore(productRepo),
  new DeleteProduct(productRepo, storeRepo)
);

// Públicas
router.get('/store/:storeId', productController.listByStore.bind(productController));
router.get('/:id', productController.getById.bind(productController));

// Protegidas (seller)
router.post('/', authMiddleware, requireRole(['seller']), validate(createProductSchema), productController.create.bind(productController));
router.put('/:id', authMiddleware, requireRole(['seller']), validate(updateProductSchema), productController.update.bind(productController));
router.delete('/:id', authMiddleware, requireRole(['seller']), productController.delete.bind(productController));

export default router;
