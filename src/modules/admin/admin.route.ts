import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidations } from './admin.validation';
import { AdminControllers } from './admin.controller';

const router = Router();

// create admin route
router.post(
    '/',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    validateRequest(AdminValidations.createAdminValidationSchema),
    AdminControllers.createAdmin,
);

// get all admins route
router.get(
    '/',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    AdminControllers.getAllAdmins,
);

// get all deleted admins route
router.get(
    '/deleted-admins',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    AdminControllers.getAllDeletedAdmins,
);

// get teams route
router.get('/teams', AdminControllers.getTeams);

// get single admin route
router.get(
    '/:id',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    AdminControllers.getSingleAdmin,
);

// update admin route
router.patch(
    '/:id/update',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(AdminValidations.updateAdminValidationSchema),
    AdminControllers.updateAdmin,
);

// update admin password route
router.patch(
    '/:id/update-password',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(AdminValidations.updateAdminPasswordValidationSchema),
    AdminControllers.updateAdminPassword,
);

// delete admin route
router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin),
    AdminControllers.deleteAdmin,
);

// delete permanent admin route
router.delete(
    '/:id/delete-permanent',
    auth(USER_ROLES.superAdmin),
    AdminControllers.deletePermanentAdmin,
);

export const AdminRoutes = router;
