import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { BranchValidations } from './branch.validation';
import { BranchControllers } from './branch.controller';

const router = Router();

// create branch route
router.post(
    '/',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    validateRequest(BranchValidations.createBranchValidationSchema),
    BranchControllers.createBranch,
);

// get all branches route
router.get('/', BranchControllers.getAllBranches);

// get single branch route
router.get(
    '/:id',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    BranchControllers.getSingleBranch,
);

// update branch route
router.patch(
    '/:id/update',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    validateRequest(BranchValidations.updateBranchValidationSchema),
    BranchControllers.updateBranch,
);

// delete branch route
router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    BranchControllers.deleteBranch,
);

export const BranchRoutes = router;
