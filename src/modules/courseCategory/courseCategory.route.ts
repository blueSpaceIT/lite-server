import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { CourseCategoryValidations } from './courseCategory.validation';
import { CourseCategoryControllers } from './courseCategory.controller';

const router = Router();

// create course category route
router.post(
    '/',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(
        CourseCategoryValidations.createCourseCategoryValidationSchema,
    ),
    CourseCategoryControllers.createCourseCategory,
);

// get all course categories route
router.get('/', CourseCategoryControllers.getAllCourseCategories);

// get single course category route
router.get('/:id', CourseCategoryControllers.getSingleCourseCategory);

// update course category route
router.patch(
    '/:id/update',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(
        CourseCategoryValidations.updateCourseCategoryValidationSchema,
    ),
    CourseCategoryControllers.updateCourseCategory,
);

// delete course category route
router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    CourseCategoryControllers.deleteCourseCategory,
);

export const CourseCategoryRoutes = router;
