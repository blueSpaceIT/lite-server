import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { ProductCategoryValidations } from './productCategory.validation';
import { ProductCategoryControllers } from './productCategory.controller';

const router = Router();

// create product category route
router.post(
    '/',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(
        ProductCategoryValidations.createProductCategoryValidationSchema,
    ),
    ProductCategoryControllers.createProductCategory,
);

// get all product categories route
router.get('/', ProductCategoryControllers.getAllProductCategories);

// get single product category route
router.get('/:id', ProductCategoryControllers.getSingleProductCategory);

// update product category route
router.patch(
    '/:id/update',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(
        ProductCategoryValidations.updateProductCategoryValidationSchema,
    ),
    ProductCategoryControllers.updateProductCategory,
);

// delete product category route
router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    ProductCategoryControllers.deleteProductCategory,
);

export const ProductCategoryRoutes = router;
