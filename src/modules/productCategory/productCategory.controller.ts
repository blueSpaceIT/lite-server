import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductCategoryServices } from './productCategory.service';

// create product category controller
const createProductCategory = catchAsync(async (req, res) => {
    const result = await ProductCategoryServices.createProductCategoryIntoDB(
        req.body,
    );
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Product category has been created successfully',
        data: result,
    });
});

// get all product categories controller
const getAllProductCategories = catchAsync(async (req, res) => {
    const result = await ProductCategoryServices.getAllProductCategoriesFromDB(
        req.query,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All product categories have been retrieved successfully',
        data: result,
    });
});

// get single product category controller
const getSingleProductCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result =
        await ProductCategoryServices.getSinglProductCategoryFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Product category has been retrieved successfully',
        data: result,
    });
});

// update product category controller
const updateProductCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ProductCategoryServices.updateProductCategoryIntoDB(
        id,
        req.body,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Product category has been updated successfully',
        data: result,
    });
});

// delete product category controller
const deleteProductCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result =
        await ProductCategoryServices.deleteProductCategoryFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Product category has been deleted successfully',
        data: result,
    });
});

export const ProductCategoryControllers = {
    createProductCategory,
    getAllProductCategories,
    getSingleProductCategory,
    updateProductCategory,
    deleteProductCategory,
};
