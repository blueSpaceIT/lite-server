import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../user/user.constant';
import { ArticleCategoryValidations } from './articleCategory.validation';
import { ArticleCategoryControllers } from './articleCategory.controller';

const router = Router();

// create article category route
router.post(
    '/',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(
        ArticleCategoryValidations.createArticleCategoryValidationSchema,
    ),
    ArticleCategoryControllers.createArticleCategory,
);

// get all article categories route
router.get('/', ArticleCategoryControllers.getAllArticleCategories);

// get single article category route
router.get('/:id', ArticleCategoryControllers.getSingleArticleCategory);

// update article category route
router.patch(
    '/:id/update',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(
        ArticleCategoryValidations.updateArticleCategoryValidationSchema,
    ),
    ArticleCategoryControllers.updateArticleCategory,
);

// delete article category route
router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    ArticleCategoryControllers.deleteArticleCategory,
);

export const ArticleCategoryRoutes = router;
