import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { AccountValidations } from './account.validation';
import { AccountControllers } from './account.controller';

const router = Router();

// create account route
router.post(
    '/',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    validateRequest(AccountValidations.createAccountValidationSchema),
    AccountControllers.createAccount,
);

// get all accounts route
router.get(
    '/',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    AccountControllers.getAllAccounts,
);

// get single account route
router.get(
    '/:id',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    AccountControllers.getSingleAccount,
);

// get account year summary for admin route
router.get(
    '/:year/year-summary/for-admin',
    auth(USER_ROLES.superAdmin),
    AccountControllers.getAccountYearSummaryForAdmin,
);

// get account summary for admin route
router.get(
    '/:startDate/:endDate/for-admin',
    auth(USER_ROLES.superAdmin),
    AccountControllers.getAccountSummaryForAdmin,
);

// get account summary by branch route
router.get(
    '/:id/:startDate/:endDate',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    AccountControllers.getAccountSummaryByBranch,
);

// update account route
router.patch(
    '/:id/update',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    validateRequest(AccountValidations.updateAccountValidationSchema),
    AccountControllers.updateAccount,
);

// delete account route
router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin),
    AccountControllers.deleteAccount,
);

export const AccountRoutes = router;
