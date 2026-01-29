import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidations } from './auth.validation';
import { AuthControllers } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = Router();

// signin route
router.post(
    '/signin/:userType',
    validateRequest(AuthValidations.signinValidationSchema),
    AuthControllers.signin,
);

// get me route
router.get(
    '/me/:userType',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    AuthControllers.getMe,
);

// get new access token route
router.get(
    '/access-token/:userType',
    validateRequest(AuthValidations.refreshTokenValidationSchema),
    AuthControllers.getNewAccessToken,
);

// forget password route
router.post(
    '/forget-password/:userType',
    validateRequest(AuthValidations.forgetPasswordValidationSchema),
    AuthControllers.forgetPassword,
);

// reset password route
router.post(
    '/reset-password/:userType',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    validateRequest(AuthValidations.resetPasswordValidationSchema),
    AuthControllers.resetPassword,
);

export const AuthRoutes = router;
