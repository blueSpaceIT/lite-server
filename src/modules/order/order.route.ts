import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidations } from './order.validation';
import { OrderControllers } from './order.controller';
const router = Router();

// create order route
router.post(
    '/',
    validateRequest(OrderValidations.createOrderValidationSchema),
    OrderControllers.createOrder,
);

// get all orders route
router.get(
    '/',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    OrderControllers.getAllOrders,
);

// get all my orders route
router.get(
    '/my-orders',
    auth(USER_ROLES.student),
    OrderControllers.getAllMyOrders,
);

// get all my orders route
router.get(
    '/my-ebooks',
    auth(USER_ROLES.student),
    OrderControllers.getAllMyEbooks,
);

// get single order route
router.get('/:id', OrderControllers.getSingleOrder);

// get single valid order route
router.get(
    '/:id/my-order',
    auth(USER_ROLES.student),
    OrderControllers.getSingleValidOrder,
);

// update course route
router.patch(
    '/:id/update',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    validateRequest(OrderValidations.updateOrderValidationSchema),
    OrderControllers.updateOrder,
);

// delete order route
router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    OrderControllers.deleteOrder,
);

export const OrderRoutes = router;
