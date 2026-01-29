import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../user/user.constant';
import { NewsCategoryValidations } from './newsCategory.validation';
import { NewsCategoryControllers } from './newsCategory.controller';

const router = Router();

// create news category route
router.post(
    '/',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(NewsCategoryValidations.createNewsCategoryValidationSchema),
    NewsCategoryControllers.createNewsCategory,
);

// get all news categories route
router.get('/', NewsCategoryControllers.getAllNewsCategories);

// get single news category route
router.get('/:id', NewsCategoryControllers.getSingleNewsCategory);

// update news category route
router.patch(
    '/:id/update',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(NewsCategoryValidations.updateNewsCategoryValidationSchema),
    NewsCategoryControllers.updateNewsCategory,
);

// delete news category route
router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    NewsCategoryControllers.deleteNewsCategory,
);

export const NewsCategoryRoutes = router;
