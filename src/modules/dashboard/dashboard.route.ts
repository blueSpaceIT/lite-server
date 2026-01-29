import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
import { DashboardControllers } from './dashboard.controller';

const router = Router();

// get dashboard widget counting route
router.get(
    '/widget-count',
    auth(USER_ROLES.student),
    DashboardControllers.getDashboardWidgetCounting,
);

export const DashboardRoutes = router;
