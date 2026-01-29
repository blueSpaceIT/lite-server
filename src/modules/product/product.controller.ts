import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductServices } from './product.service';

// create product controller
const createProduct = catchAsync(async (req, res) => {
    const result = await ProductServices.createProductIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Product has been created successfully',
        data: result,
    });
});

// get all products controller
const getAllProducts = catchAsync(async (req, res) => {
    const result = await ProductServices.getAllProductsFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All products have been retrieved successfully',
        data: result,
    });
});

// get single product controller
const getSingleProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ProductServices.getSingleProductFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Product has been retrieved successfully',
        data: result,
    });
});

// update product controller
const updateProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ProductServices.updateProductIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Product has been updated successfully',
        data: result,
    });
});

// delete product controller
const deleteProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ProductServices.deleteProductFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Product has been deleted successfully',
        data: result,
    });
});

export const ProductControllers = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
};
