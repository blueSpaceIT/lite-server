import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PurchaseServices } from './purchase.service';

// create purchase controller
const createPurchase = catchAsync(async (req, res) => {
    const result = await PurchaseServices.createPurchaseIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Purchase has been created successfully',
        data: result,
    });
});

// get all purchases controller
const getAllPurchases = catchAsync(async (req, res) => {
    const result = await PurchaseServices.getAllPurchasesFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All purchases have been retrieved successfully',
        data: result,
    });
});

// get due purchases controller
const getDuePurchases = catchAsync(async (req, res) => {
    const result = await PurchaseServices.getDuePurchasesFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Due purchases have been retrieved successfully',
        data: result,
    });
});

// get all my purchases controller
const getAllMyPurchases = catchAsync(async (req, res) => {
    const result = await PurchaseServices.getAllMyPurchasesFromDB(
        req.user,
        req.query,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All purchases have been retrieved successfully',
        data: result,
    });
});

// get single purchase controller
const getSinglePurchase = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await PurchaseServices.getSinglePurchaseFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Purchase has been retrieved successfully',
        data: result,
    });
});

// get single valid purchase controller
const getSingleValidPurchase = catchAsync(async (req, res) => {
    const { courseID } = req.params;
    const result = await PurchaseServices.getSingleValidPurchaseFromDB(
        req.user,
        courseID,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Purchase has been retrieved successfully',
        data: result,
    });
});

// update purchase controller
const updatePurchase = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await PurchaseServices.updatePurchaseIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Purchase has been updated successfully',
        data: result,
    });
});

// delete purchase controller
const deletePurchase = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await PurchaseServices.deletePurchaseFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Purchase has been deleted successfully',
        data: result,
    });
});

export const PurchaseControllers = {
    createPurchase,
    getAllPurchases,
    getDuePurchases,
    getAllMyPurchases,
    getSinglePurchase,
    getSingleValidPurchase,
    updatePurchase,
    deletePurchase,
};
