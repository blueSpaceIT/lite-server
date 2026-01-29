import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderServices } from './order.service';

// create order controller
const createOrder = catchAsync(async (req, res) => {
    const result = await OrderServices.createOrderIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Order has been created successfully',
        data: result,
    });
});

// get all orders controller
const getAllOrders = catchAsync(async (req, res) => {
    const result = await OrderServices.getAllOrdersFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All orders have been retrieved successfully',
        data: result,
    });
});

// get all my orders controller
const getAllMyOrders = catchAsync(async (req, res) => {
    const result = await OrderServices.getAllMyOrdersFromDB(
        req.user,
        req.query,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All orders have been retrieved successfully',
        data: result,
    });
});

// get all my ebooks controller
const getAllMyEbooks = catchAsync(async (req, res) => {
    const result = await OrderServices.getAllMyEbooksFromDB(req.user);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All ebooks have been retrieved successfully',
        data: result,
    });
});

// get single order controller
const getSingleOrder = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OrderServices.getSingleOrderFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Order has been retrieved successfully',
        data: result,
    });
});

// get single valid order controller
const getSingleValidOrder = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OrderServices.getSingleValidOrderFromDB(req.user, id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Order has been retrieved successfully',
        data: result,
    });
});

// update Order controller
const updateOrder = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OrderServices.updateOrderIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Order has been updated successfully',
        data: result,
    });
});

// delete order controller
const deleteOrder = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OrderServices.deleteOrderFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Order has been deleted successfully',
        data: result,
    });
});

export const OrderControllers = {
    createOrder,
    getAllOrders,
    getAllMyOrders,
    getAllMyEbooks,
    getSingleOrder,
    getSingleValidOrder,
    updateOrder,
    deleteOrder,
};
