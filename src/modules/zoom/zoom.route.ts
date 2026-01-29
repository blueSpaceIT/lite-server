import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ZoomValidations } from './zoom.validation';
import { ZoomControllers } from './zoom.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = Router();

// create zoom signature route
router.post(
    '/',
    auth(USER_ROLES.student),
    validateRequest(ZoomValidations.zoomValidationSchema),
    ZoomControllers.zoomSignature,
);

export const ZoomRoutes = router;
