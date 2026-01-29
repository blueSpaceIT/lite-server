import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { MarqueeValidations } from './marquee.validation';
import { MarqueeControllers } from './marquee.controller';

const router = Router();

// create marquee route
router.post(
    '/',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    validateRequest(MarqueeValidations.marqueeValidationSchema),
    MarqueeControllers.createMarquee,
);

// get single marquee route
router.get('/:id', MarqueeControllers.getSingleMarquee);

export const MarqueeRoutes = router;
