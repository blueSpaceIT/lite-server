import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MarqueeServices } from './marquee.service';

// create marquee controller
const createMarquee = catchAsync(async (req, res) => {
    const result = await MarqueeServices.createMarqueeIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Marquee has been created successfully',
        data: result,
    });
});

// get single marquee controller
const getSingleMarquee = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await MarqueeServices.getSingleMarqueeFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Marquee has been retrieved successfully',
        data: result,
    });
});

export const MarqueeControllers = {
    createMarquee,
    getSingleMarquee,
};
