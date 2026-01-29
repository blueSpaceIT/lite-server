import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { ModuleValidations } from './module.validation';
import { ModuleControllers } from './module.controller';

const router = Router();

// create module route
router.post(
    '/',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(ModuleValidations.createModuleValidationSchema),
    ModuleControllers.createModule,
);

// get all modules route
router.get('/', ModuleControllers.getAllModules);

// get single module route
router.get('/:id', ModuleControllers.getSingleModule);

// update module route
router.patch(
    '/:id/update',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(ModuleValidations.updateModuleValidationSchema),
    ModuleControllers.updateModule,
);

// delete module route
router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    ModuleControllers.deleteModule,
);

export const ModuleRoutes = router;
