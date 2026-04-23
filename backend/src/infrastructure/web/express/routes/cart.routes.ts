import { Router } from 'express';
import { CartController } from '../controllers/CartController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { validate } from '../../../../shared/middlewares/validate';
import { addItemSchema, updateCartItemSchema } from '../../../../shared/validation/cartSchemas';
import { CartRepository } from '../../../database/sqlite/repositories/CartRepository';
import { ProductRepository } from '../../../database/sqlite/repositories/ProductRepository';
import { StoreRepository } from '../../../database/sqlite/repositories/StoreRepository';
import { AddItemToCart } from '../../../../application/use-cases/cart/AddItemToCart';
import { GetCart } from '../../../../application/use-cases/cart/GetCart';
import { RemoveItemFromCart } from '../../../../application/use-cases/cart/RemoveItemFromCart';
import { ClearCart } from '../../../../application/use-cases/cart/ClearCart';

const router = Router();

const cartRepo = new CartRepository();
const productRepo = new ProductRepository();
const storeRepo = new StoreRepository();

const cartController = new CartController(
  new AddItemToCart(cartRepo, productRepo),
  new GetCart(cartRepo, productRepo, storeRepo),
  new RemoveItemFromCart(cartRepo),
  new ClearCart(cartRepo)
);

// Todas as rotas do carrinho são protegidas (apenas cliente/seller/admin)
router.use(authMiddleware, requireRole(['customer', 'seller', 'admin']));

router.post('/items', validate(addItemSchema), cartController.addItem.bind(cartController));
router.get('/', cartController.getCart.bind(cartController));
router.delete('/items/:id', cartController.removeItem.bind(cartController));
router.delete('/', cartController.clearCart.bind(cartController));

export default router;
