import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PayStationControllers } from './paystation.controller';
import { PayStationValidations } from './paystation.validation';

const router = Router();

// initiate payment
router.post(
    '/create-payment',
    validateRequest(PayStationValidations.createPaymentSchema),
    PayStationControllers.createPayment,
);

// callback (PayStation redirects here)
router.get('/callback/:type', PayStationControllers.handleCallback);

// optional manual verification
router.post('/verify-payment', PayStationControllers.verifyPayment);

export const PayStationRoutes = router;
