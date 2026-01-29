import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseContentValidations } from './courseContent.validation';
import { CourseContentControllers } from './courseContent.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = Router();

// Course Content Routes
router.get('/', CourseContentControllers.getAllCourseContents);

router.get('/curriculum', CourseContentControllers.getAllCourseCurriculum);

router.get(
    '/curriculum/:id/purchased',
    auth(USER_ROLES.student),
    CourseContentControllers.getPurchasedCourseCurriculum,
);

router.get(
    '/content/:id/purchased',
    auth(USER_ROLES.student),
    CourseContentControllers.getPurchasedSingleCourseContent,
);

router.get(
    '/exam/:id/purchased',
    auth(USER_ROLES.student),
    CourseContentControllers.getPurchasedExamWithAnswer,
);

router.patch(
    '/:id/update',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    CourseContentControllers.updateCourseContent,
);

router.delete(
    '/:id/delete',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    CourseContentControllers.deleteCourseContent,
);

// Live Class Routes
router.post(
    '/create-live-class',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(
        CourseContentValidations.createCourseContentValidationSchema,
    ),
    CourseContentControllers.createLiveClass,
);

router.get(
    '/live-classes',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    CourseContentControllers.getAllLiveClasses,
);

router.get(
    '/live-classes/:id',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    CourseContentControllers.getSingleLiveClass,
);

router.patch(
    '/live-classes/:id/update',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(
        CourseContentValidations.updateCourseContentValidationSchema,
    ),
    CourseContentControllers.updateLiveClass,
);

router.delete(
    '/live-classes/:id/delete',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    CourseContentControllers.deleteLiveClass,
);

// Lecture Routes
router.post(
    '/create-lecture',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(
        CourseContentValidations.createCourseContentValidationSchema,
    ),
    CourseContentControllers.createLecture,
);

router.get(
    '/lectures',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    CourseContentControllers.getAllLectures,
);

router.get(
    '/lectures/:id',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    CourseContentControllers.getSingleLecture,
);

router.patch(
    '/lectures/:id/update',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(
        CourseContentValidations.updateCourseContentValidationSchema,
    ),
    CourseContentControllers.updateLecture,
);

router.delete(
    '/lectures/:id/delete',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    CourseContentControllers.deleteLecture,
);

// Note Routes
router.post(
    '/create-note',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(
        CourseContentValidations.createCourseContentValidationSchema,
    ),
    CourseContentControllers.createNote,
);

router.get(
    '/notes',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    CourseContentControllers.getAllNotes,
);

router.get(
    '/notes/:id',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    CourseContentControllers.getSingleNote,
);

router.patch(
    '/notes/:id/update',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(
        CourseContentValidations.updateCourseContentValidationSchema,
    ),
    CourseContentControllers.updateNote,
);

router.delete(
    '/notes/:id/delete',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    CourseContentControllers.deleteNote,
);

// Exam Routes
router.post(
    '/create-exam',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(
        CourseContentValidations.createCourseContentValidationSchema,
    ),
    CourseContentControllers.createExam,
);

router.get(
    '/exams',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    CourseContentControllers.getAllExams,
);

router.get('/exams/today', CourseContentControllers.getTodaysExams);

router.get(
    '/exams/:id',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    CourseContentControllers.getSingleExam,
);

router.patch(
    '/exams/:id/update',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    validateRequest(
        CourseContentValidations.updateCourseContentValidationSchema,
    ),
    CourseContentControllers.updateExam,
);

router.delete(
    '/exams/:id/delete',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    CourseContentControllers.deleteExam,
);

export const CourseContentRoutes = router;
