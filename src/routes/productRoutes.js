import {
    create,
    getAll,
    getOne,
    update,
    remove
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateCreateProduct, validateUpdateProduct } from '../middleware/productValidationMiddleware.js';
import express from 'express';

const router = express.Router();

// Public routes to view products
router.get('/', getAll);
router.get('/:id', getOne);

// Only admins can create, update, or delete products
// Use schema enum value "ADMIN" for role checks.
router.post('/', authenticate, authorize(['ADMIN']), validateCreateProduct, create);
router.put('/:id', authenticate, authorize(['ADMIN']), validateUpdateProduct, update);
router.delete('/:id', authenticate, authorize(['ADMIN']), remove);

export default router;
