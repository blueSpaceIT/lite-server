/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PayStationServices } from './paystation.service';


const createPayment = catchAsync(async (req, res) => {
    const result = await PayStationServices.createPaymentRequest(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Payment initialized successfully',
        data: result,
    });
});

const handleCallback = catchAsync(async (req, res) => {
    const { type } = req.params;
    const result = await PayStationServices.handleCallback(type, req.query as any);
    res.redirect(result);
});

const verifyPayment = catchAsync(async (req, res) => {
    const result = await PayStationServices.verifyTransaction(req.body.invoice_number);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Transaction verified successfully',
        data: result,
    });
});

export const PayStationControllers = {
    createPayment,
    handleCallback,
    verifyPayment,
};
