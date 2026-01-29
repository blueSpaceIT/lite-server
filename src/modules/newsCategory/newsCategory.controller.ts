import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NewsCategoryServices } from './newsCategory.service';

// create news category controller
const createNewsCategory = catchAsync(async (req, res) => {
    const result = await NewsCategoryServices.createNewsCategoryIntoDB(
        req.body,
    );
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'News category has been created successfully',
        data: result,
    });
});

// get all news categories controller
const getAllNewsCategories = catchAsync(async (req, res) => {
    const result = await NewsCategoryServices.getAllNewsCategoriesFromDB(
        req.query,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All news categories have been retrieved successfully',
        data: result,
    });
});

// get single news category controller
const getSingleNewsCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await NewsCategoryServices.getSingleNewsCategoryFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'News category has been retrieved successfully',
        data: result,
    });
});

// update news category controller
const updateNewsCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await NewsCategoryServices.updateNewsCategoryIntoDB(
        id,
        req.body,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'News category has been updated successfully',
        data: result,
    });
});

// delete news category controller
const deleteNewsCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await NewsCategoryServices.deleteNewsCategoryFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'News category has been deleted successfully',
        data: result,
    });
});

export const NewsCategoryControllers = {
    createNewsCategory,
    getAllNewsCategories,
    getSingleNewsCategory,
    updateNewsCategory,
    deleteNewsCategory,
};
