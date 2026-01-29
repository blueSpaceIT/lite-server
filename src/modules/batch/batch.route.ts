import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { BatchValidations } from './batch.validation';
import { BatchControllers } from './batch.controller';

const router = Router();

// create batch route
router.post(
    '/',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    validateRequest(BatchValidations.createBatchValidationSchema),
    BatchControllers.createBatch,
);

// get all batches route
router.get('/', BatchControllers.getAllBatches);

// get single batch route
router.get('/:id', BatchControllers.getSingleBatch);

// update batch route
router.patch(
    '/:id/update',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.moderator),
    validateRequest(BatchValidations.updateBatchValidationSchema),
    BatchControllers.updateBatch,
);

// delete batch route
router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    BatchControllers.deleteBatch,
);

export const BatchRoutes = router;
