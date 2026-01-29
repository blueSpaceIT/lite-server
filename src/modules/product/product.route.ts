import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidations } from './product.validation';
import { ProductControllers } from './product.controller';

const router = Router();

// create product route
router.post(
    '/',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    validateRequest(ProductValidations.createProductValidationSchema),
    ProductControllers.createProduct,
);

// get all products route
router.get('/', ProductControllers.getAllProducts);

// get single product route
router.get('/:id', ProductControllers.getSingleProduct);

// update product route
router.patch(
    '/:id/update',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    validateRequest(ProductValidations.updateProductValidationSchema),
    ProductControllers.updateProduct,
);

// delete product route
router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    ProductControllers.deleteProduct,
);

export const ProductRoutes = router;
