import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { CourseReviewValidations } from './courseReview.validation';
import { CourseReviewControllers } from './courseReview.controller';

const router = Router();

// create course review route
router.post(
    '/',
    auth(USER_ROLES.student),
    validateRequest(CourseReviewValidations.createCourseReviewValidationSchema),
    CourseReviewControllers.createCourseReview,
);

// get all course reviews route
router.get('/', CourseReviewControllers.getAllCourseReviews);

// get single course review route
router.get('/:id', CourseReviewControllers.getSingleCourseReview);

// get my course review route
router.get(
    '/:id/me',
    auth(USER_ROLES.student),
    CourseReviewControllers.getMyCourseReview,
);

// update course review route
router.patch(
    '/:id/update',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    validateRequest(CourseReviewValidations.updateCourseReviewValidationSchema),
    CourseReviewControllers.updateCourseReview,
);

// delete course review route
router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    CourseReviewControllers.deleteCourseReview,
);

export const CourseReviewRoutes = router;
