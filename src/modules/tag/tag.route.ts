import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { TagValidations } from './tag.validation';
import { TagControllers } from './tag.controller';

const router = Router();

router.post(
    '/',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    validateRequest(TagValidations.createTagValidationSchema),
    TagControllers.createTag,
);

router.get(
    '/',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    TagControllers.getAllTags,
);

router.get(
    '/:id',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    TagControllers.getSingleTag,
);

router.patch(
    '/:id/update',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    validateRequest(TagValidations.updateTagValidationSchema),
    TagControllers.updateTag,
);

router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    TagControllers.deleteTag,
);

export const TagRoutes = router;
