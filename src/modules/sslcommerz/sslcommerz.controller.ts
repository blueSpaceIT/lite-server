import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SSLCommerzServices } from './sslcommerz.service';

// create payment controller
const createPayment = catchAsync(async (req, res) => {
    const result = await SSLCommerzServices.createPaymentRequest(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Payment has been created successfully',
        data: result,
    });
});

// verify payment controller
const verifyPayment = catchAsync(async (req, res) => {
    const { type } = req.params;
    const result = await SSLCommerzServices.verifyPaymentRequest(
        type,
        req.body,
    );
    res.redirect(result);
});

// notify payment controller
const notifyPayment = catchAsync(async (req, res) => {
    const result = await SSLCommerzServices.notifyPaymentRequest(req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Payment has been notified successfully',
        data: result,
    });
});

export const SSLCommerzControllers = {
    createPayment,
    verifyPayment,
    notifyPayment,
};
