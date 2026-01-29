import { Router } from 'express';
import auth from '../../middlewares/auth';
import { upload } from '../../utils/sendImageToCloudinary';
import { USER_ROLES } from '../user/user.constant';
import { MediaControllers } from './media.controller';

const router = Router();

// create media route
router.post(
    '/:width/:height',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    upload.single('file'),
    MediaControllers.createMedia,
);

// upload pdf route
router.post(
    '/upload-pdf',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    upload.single('file'),
    MediaControllers.uploadPDF,
);

// get all media route
router.get(
    '/',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
    ),
    MediaControllers.getAllMedia,
);

// get single media route
router.get(
    '/:id',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    MediaControllers.getSingleMedia,
);

// delete media route
router.delete(
    '/:id/delete',
    auth(
        USER_ROLES.superAdmin,
        USER_ROLES.admin,
        USER_ROLES.moderator,
        USER_ROLES.teacher,
        USER_ROLES.student,
    ),
    MediaControllers.deleteMedia,
);

router.post("/merge-chunks", MediaControllers.mergeChunks);
router.post("/videos", MediaControllers.createVideo);

export const MediaRoutes = router;
