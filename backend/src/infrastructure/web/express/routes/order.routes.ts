import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { validate } from '../../../../shared/middlewares/validate';
import { checkoutSchema } from '../../../../shared/validation/orderSchemas';
import { CartRepository } from '../../../database/sqlite/repositories/CartRepository';
import { ProductRepository } from '../../../database/sqlite/repositories/ProductRepository';
import { StoreRepository } from '../../../database/sqlite/repositories/StoreRepository';
import { OrderRepository } from '../../../database/sqlite/repositories/OrderRepository';
import { MockPaymentGateway } from '../../../payment/MockPaymentGateway';
import { CheckoutOrder } from '../../../../application/use-cases/order/CheckoutOrder';
import { GetCustomerOrders } from '../../../../application/use-cases/order/GetCustomerOrders';
import { GetOrderById } from '../../../../application/use-cases/order/GetOrderById';

const router = Router();

const cartRepo = new CartRepository();
const productRepo = new ProductRepository();
const storeRepo = new StoreRepository();
const orderRepo = new OrderRepository();
const paymentGateway = new MockPaymentGateway();

const orderController = new OrderController(
  new CheckoutOrder(cartRepo, productRepo, storeRepo, orderRepo, paymentGateway),
  new GetCustomerOrders(orderRepo),
  new GetOrderById(orderRepo)
);

// Rotas protegidas
router.post('/checkout', authMiddleware, requireRole(['customer']), validate(checkoutSchema), orderController.checkout.bind(orderController));
router.get('/', authMiddleware, orderController.listMyOrders.bind(orderController));
router.get('/:id', authMiddleware, orderController.getById.bind(orderController));

export default router;
