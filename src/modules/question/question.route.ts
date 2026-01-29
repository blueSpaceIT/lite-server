import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { QuestionValidations } from './question.validation';
import { QuestionControllers } from './question.controller';

const router = Router();

// create question route
router.post(
    '/',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    validateRequest(QuestionValidations.createQuestionValidationSchema),
    QuestionControllers.createQuestion,
);

// get all questions route
router.get('/', QuestionControllers.getAllQuestions);

// get all questions by tags route
router.get(
    '/filter-tags',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    QuestionControllers.getAllQuestionsByTags,
);

// get all questions by tags in depth route
router.get(
    '/filter-tags-depth',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    QuestionControllers.getAllQuestionsByTagsInDepth,
);

// get single question route
router.get('/:id', QuestionControllers.getSingleQuestion);

// update question route
router.patch(
    '/:id/update',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    validateRequest(QuestionValidations.updateQuestionValidationSchema),
    QuestionControllers.updateQuestion,
);

// delete question route
router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    QuestionControllers.deleteQuestion,
);

export const QuestionRoutes = router;
