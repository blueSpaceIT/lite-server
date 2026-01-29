import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { ZoomServices } from './zoom.service';
import sendResponse from '../../utils/sendResponse';

const zoomSignature = catchAsync(async (req, res) => {
    const result = await ZoomServices.createZoomSignature(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Zoom signature has been created successfully',
        data: result,
    });
});

export const ZoomControllers = {
    zoomSignature,
};
