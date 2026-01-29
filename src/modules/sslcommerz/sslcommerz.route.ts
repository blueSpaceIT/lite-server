import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SSLCommerzValidations } from './sslcommerz.validation';
import { SSLCommerzControllers } from './sslcommerz.controller';
import { upload } from '../../utils/sendImageToCloudinary';

const router = Router();

// create payment route
router.post(
    '/create-payment',
    validateRequest(SSLCommerzValidations.SSLCommerzValidationSchema),
    SSLCommerzControllers.createPayment,
);

// verify payment route
router.post(
    '/verify-payment/:type',
    upload.none(),
    SSLCommerzControllers.verifyPayment,
);

// notify payment route
router.post('/notify', upload.none(), SSLCommerzControllers.notifyPayment);

export const SSLCommerzRoutes = router;
