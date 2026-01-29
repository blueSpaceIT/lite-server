import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';

const router = Router();

// create course route
router.post(
    '/',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    validateRequest(CourseValidations.createCourseValidationSchema),
    CourseControllers.createCourse,
);

// get all courses route
router.get('/', CourseControllers.getAllCourses);

// get all free course route
router.get('/free', CourseControllers.getAllFreeCourses);

// get single course route
router.get('/:id', CourseControllers.getSingleCourse);

// update course route
router.patch(
    '/:id/update',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    validateRequest(CourseValidations.updateCourseValidationSchema),
    CourseControllers.updateCourse,
);

// update course details route
router.patch(
    '/:id/update-details',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    validateRequest(CourseValidations.courseDetailsValidationSchema),
    CourseControllers.updateCourseDetails,
);

// delete course route
router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    CourseControllers.deleteCourse,
);

export const CourseRoutes = router;
