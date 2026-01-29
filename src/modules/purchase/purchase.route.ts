import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { PurchaseValidations } from './purchase.validation';
import { PurchaseControllers } from './purchase.controller';

const router = Router();

// create purchase route
router.post(
    '/',
    validateRequest(PurchaseValidations.createPurchaseValidationSchema),
    PurchaseControllers.createPurchase,
);

// get all purchases route
router.get(
    '/',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    PurchaseControllers.getAllPurchases,
);

// get due purchases route
router.get(
    '/due-purchases',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    PurchaseControllers.getDuePurchases,
);

// get all my purchases route
router.get(
    '/my-purchases',
    auth(USER_ROLES.student),
    PurchaseControllers.getAllMyPurchases,
);

// get single purchase route
router.get(
    '/:id',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    PurchaseControllers.getSinglePurchase,
);

// get single valid purchase route
router.get(
    '/:courseID/my-course',
    auth(USER_ROLES.student),
    PurchaseControllers.getSingleValidPurchase,
);

// update course route
router.patch(
    '/:id/update',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    validateRequest(PurchaseValidations.updatePurchaseValidationSchema),
    PurchaseControllers.updatePurchase,
);

// delete purchase route
router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    PurchaseControllers.deletePurchase,
);

export const PurchaseRoutes = router;
