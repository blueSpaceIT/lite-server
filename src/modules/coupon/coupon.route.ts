import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { CouponValidations } from './coupon.validation';
import { CouponControllers } from './coupon.controller';

const router = Router();

// create coupon route
router.post(
    '/',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    validateRequest(CouponValidations.createCouponValidationSchema),
    CouponControllers.createCoupon,
);

// get all coupons route
router.get(
    '/',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    CouponControllers.getAllCoupons,
);

// get single coupon route
router.get(
    '/:id',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    CouponControllers.getSingleCoupon,
);

// get single coupon by name route
router.post('/:name', CouponControllers.getSingleCouponByName);

// update coupon route
router.patch(
    '/:id/update',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    validateRequest(CouponValidations.updateCouponValidationSchema),
    CouponControllers.updateCoupon,
);

// delete coupon route
router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    CouponControllers.deleteCoupon,
);

export const CouponRoutes = router;
