import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../user/user.constant';
import { ArticleValidations } from './article.validation';
import { ArticleControllers } from './article.controller';

const router = Router();

// create article route
router.post(
    '/',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(ArticleValidations.createArticleValidationSchema),
    ArticleControllers.createArticle,
);

// get all articles route
router.get('/', ArticleControllers.getAllArticles);

// get single article  route
router.get('/:id', ArticleControllers.getSingleArticle);

// update article route
router.patch(
    '/:id/update',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(ArticleValidations.updateArticleValidationSchema),
    ArticleControllers.updateArticle,
);

// delete article route
router.delete(
    '/:id/delete',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    ArticleControllers.deleteArticle,
);

export const ArticleRoutes = router;
