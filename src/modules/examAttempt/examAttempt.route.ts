import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { ExamAttemptValidations } from './examAttempt.validation';
import { ExamAttemptControllers } from './examAttempt.controller';

const router = Router();

// create mcq exam attempt route
router.post(
    '/mcq-attempt',
    auth(USER_ROLES.student),
    validateRequest(
        ExamAttemptValidations.createMCQAndGAPExamAttemptValidationSchema,
    ),
    ExamAttemptControllers.createMCQExamAttempt,
);

// create cq exam attempt route
router.post(
    '/cq-attempt',
    auth(USER_ROLES.student),
    validateRequest(ExamAttemptValidations.createCQExamAttemptValidationSchema),
    ExamAttemptControllers.createCQExamAttempt,
);

// get exam attempt route
router.get(
    '/:id',
    auth(USER_ROLES.student),
    ExamAttemptControllers.getExamAttempts,
);

// get exam attempt on admin route
router.get(
    '/:id/for-admin',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    ExamAttemptControllers.getExamAttemptsOnAdmin,
);

// get exam attempts route
router.get(
    '/:userID/:examID',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    ExamAttemptControllers.getExamAttempt,
);

// update exam attempts route
router.patch(
    '/:userID/:examID/update-cq-mark',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.teacher),
    ExamAttemptControllers.updateCQMark,
);

export const ExamAttemptRoutes = router;
