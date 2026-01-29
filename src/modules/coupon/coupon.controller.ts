import httpStatus from 'http-status';
import { CouponServices } from './coupon.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

// create coupon controller
const createCoupon = catchAsync(async (req, res) => {
    const result = await CouponServices.createCouponIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Coupon has been created successfully',
        data: result,
    });
});

// get all coupons controller
const getAllCoupons = catchAsync(async (req, res) => {
    const result = await CouponServices.getAllCouponsFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All coupons have been retrieved successfully',
        data: result,
    });
});

// get single coupon controller
const getSingleCoupon = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CouponServices.getSingleCouponFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Coupon has been retrieved successfully',
        data: result,
    });
});

// get single coupon by name controller
const getSingleCouponByName = catchAsync(async (req, res) => {
    const { name } = req.params;
    const result = await CouponServices.getSingleCouponByNameFromDB(name);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Coupon has been retrieved successfully',
        data: result,
    });
});

// update coupon controller
const updateCoupon = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CouponServices.updateCouponIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Coupon has been updated successfully',
        data: result,
    });
});

// delete coupon controller
const deleteCoupon = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CouponServices.deleteCouponFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Coupon has been deleted successfully',
        data: result,
    });
});

export const CouponControllers = {
    createCoupon,
    getAllCoupons,
    getSingleCoupon,
    getSingleCouponByName,
    updateCoupon,
    deleteCoupon,
};
