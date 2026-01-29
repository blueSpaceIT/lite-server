import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { SliderValidations } from './slider.validation';
import { SliderControllers } from './slider.controller';

const router = Router();

// create slider gallery route
router.post(
    '/create-gallery',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    validateRequest(SliderValidations.sliderGalleryValidationSchema),
    SliderControllers.createSliderGallery,
);

// create slider route
router.post(
    '/create-slider',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    validateRequest(SliderValidations.sliderValidationSchema),
    SliderControllers.createSlider,
);

// get all slider galleries route
router.get(
    '/',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    SliderControllers.getAllSliderGalleries,
);

// get single slider route
router.get('/:id', SliderControllers.getSingleSlider);

// update slider gallery route
router.patch(
    '/:id/update',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    validateRequest(SliderValidations.sliderGalleryValidationSchema),
    SliderControllers.updateSliderGallery,
);

// delete slider gallery route
router.delete(
    '/:id/delete',
    auth(USER_ROLES.superAdmin, USER_ROLES.admin),
    SliderControllers.deleteSliderGallery,
);

export const SliderRoutes = router;
