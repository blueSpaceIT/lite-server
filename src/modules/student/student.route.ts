import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidations } from './student.validation';
import { StudentControllers } from './student.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = Router();

// create student route
router.post(
    '/',
    validateRequest(StudentValidations.createStudentValidationSchema),
    StudentControllers.createStudent,
);

// upsert student route
router.put(
    '/',
    validateRequest(StudentValidations.createStudentValidationSchema),
    StudentControllers.upsertStudent,
);

// get all students route
router.get('/', StudentControllers.getAllStudents);

// get single student route
router.get('/:id', StudentControllers.getSingleStudent);

// get single student by phone route
router.get('/:phone/phone', StudentControllers.getSingleStudentByPhone);

// update student route
router.patch(
    '/:id/update',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    validateRequest(StudentValidations.updateStudentValidationSchema),
    StudentControllers.updateStudent,
);

// update student password route
router.patch(
    '/:id/update-password',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.student),
    validateRequest(StudentValidations.updateStudentPasswordValidationSchema),
    StudentControllers.updateStudentPassword,
);

// delete student route
router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin),
    StudentControllers.deleteStudent,
);

export const StudentRoutes = router;
