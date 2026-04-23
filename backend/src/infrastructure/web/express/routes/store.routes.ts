import { Router } from 'express';
import { StoreController } from '../controllers/StoreController';
import { validate } from '../../../../shared/middlewares/validate';
import { createStoreSchema, updateStoreSchema } from '../../../../shared/validation/storeSchemas';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { StoreRepository } from '../../../database/sqlite/repositories/StoreRepository';
import { UserRepository } from '../../../database/sqlite/repositories/UserRepository';
import { CreateStore } from '../../../../application/use-cases/store/CreateStore';
import { UpdateStore } from '../../../../application/use-cases/store/UpdateStore';
import { GetStoreBySlug } from '../../../../application/use-cases/store/GetStoreBySlug';
import { ListOpenStores } from '../../../../application/use-cases/store/ListOpenStores';

const router = Router();

// Dependencies
const storeRepo = new StoreRepository();
const userRepo = new UserRepository();
const createStoreUseCase = new CreateStore(storeRepo, userRepo);
const updateStoreUseCase = new UpdateStore(storeRepo);
const getStoreBySlugUseCase = new GetStoreBySlug(storeRepo);
const listOpenStoresUseCase = new ListOpenStores(storeRepo);
const storeController = new StoreController(createStoreUseCase, updateStoreUseCase, getStoreBySlugUseCase, listOpenStoresUseCase);

// Rotas públicas
router.get('/open', storeController.listOpen.bind(storeController));
router.get('/slug/:slug', storeController.getBySlug.bind(storeController));

// Rotas protegidas (apenas autenticados)
router.post('/', authMiddleware, requireRole(['seller']), validate(createStoreSchema), storeController.create.bind(storeController));
router.put('/:id', authMiddleware, requireRole(['seller', 'admin']), validate(updateStoreSchema), storeController.update.bind(storeController));

export default router;
