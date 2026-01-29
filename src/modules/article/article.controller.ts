import httpStatus from 'http-status';
import { ArticleServices } from './article.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

// create article controller
const createArticle = catchAsync(async (req, res) => {
    const result = await ArticleServices.createArticleIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Article has been created successfully',
        data: result,
    });
});

// get all articles controller
const getAllArticles = catchAsync(async (req, res) => {
    const result = await ArticleServices.getAllArticlesFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All articles have been retrieved successfully',
        data: result,
    });
});

// get single article controller
const getSingleArticle = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ArticleServices.getSingleArticleFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Article has been retrieved successfully',
        data: result,
    });
});

// update article controller
const updateArticle = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ArticleServices.updateArticleIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Article has been updated successfully',
        data: result,
    });
});

// delete article controller
const deleteArticle = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ArticleServices.deleteArticleFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Article has been deleted successfully',
        data: result,
    });
});

export const ArticleControllers = {
    createArticle,
    getAllArticles,
    getSingleArticle,
    updateArticle,
    deleteArticle,
};
