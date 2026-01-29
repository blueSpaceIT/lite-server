import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../user/user.constant';
import { NewsValidations } from './news.validation';
import { NewsControllers } from './news.controller';

const router = Router();

// create news route
router.post(
    '/',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(NewsValidations.createNewsValidationSchema),
    NewsControllers.createNews,
);

// get all news route
router.get('/', NewsControllers.getAllNews);

// get single news  route
router.get('/:id', NewsControllers.getSingleNews);

// update news route
router.patch(
    '/:id/update',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(NewsValidations.updateNewsValidationSchema),
    NewsControllers.updateNews,
);

// delete news route
router.delete(
    '/:id/delete',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    NewsControllers.deleteNews,
);

export const NewsRoutes = router;
