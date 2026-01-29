import httpStatus from 'http-status';
import { ArticleCategoryServices } from './articleCategory.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

// create article category controller
const createArticleCategory = catchAsync(async (req, res) => {
    const result = await ArticleCategoryServices.createArticleCategoryIntoDB(
        req.body,
    );
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Article category has been created successfully',
        data: result,
    });
});

// get all article categories controller
const getAllArticleCategories = catchAsync(async (req, res) => {
    const result = await ArticleCategoryServices.getAllArticleCategoriesFromDB(
        req.query,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All article categories have been retrieved successfully',
        data: result,
    });
});

// get single article category controller
const getSingleArticleCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result =
        await ArticleCategoryServices.getSingleArticleCategoryFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Article category has been retrieved successfully',
        data: result,
    });
});

// update article category controller
const updateArticleCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ArticleCategoryServices.updateArticleCategoryIntoDB(
        id,
        req.body,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Article category has been updated successfully',
        data: result,
    });
});

// delete article category controller
const deleteArticleCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result =
        await ArticleCategoryServices.deleteArticleCategoryFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Article category has been deleted successfully',
        data: result,
    });
});

export const ArticleCategoryControllers = {
    createArticleCategory,
    getAllArticleCategories,
    getSingleArticleCategory,
    updateArticleCategory,
    deleteArticleCategory,
};
