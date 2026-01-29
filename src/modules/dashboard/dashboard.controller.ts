import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DashboardServices } from './dashboard.service';

// get dashboard widget counting controller
const getDashboardWidgetCounting = catchAsync(async (req, res) => {
    const result = await DashboardServices.getDashboardWidgetCountingFromDB(
        req.user,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Dashboard widget counting has been retrieved successfully',
        data: result,
    });
});

export const DashboardControllers = {
    getDashboardWidgetCounting,
};
