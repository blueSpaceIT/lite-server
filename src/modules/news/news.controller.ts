import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NewsServices } from './news.service';

// create news controller
const createNews = catchAsync(async (req, res) => {
    const result = await NewsServices.createNewsIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'News has been created successfully',
        data: result,
    });
});

// get all news controller
const getAllNews = catchAsync(async (req, res) => {
    const result = await NewsServices.getAllNewsFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All news have been retrieved successfully',
        data: result,
    });
});

// get single news controller
const getSingleNews = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await NewsServices.getSingleNewsFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'News has been retrieved successfully',
        data: result,
    });
});

// update news controller
const updateNews = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await NewsServices.updateNewsIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'News has been updated successfully',
        data: result,
    });
});

// delete news controller
const deleteNews = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await NewsServices.deleteNewsFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'News has been deleted successfully',
        data: result,
    });
});

export const NewsControllers = {
    createNews,
    getAllNews,
    getSingleNews,
    updateNews,
    deleteNews,
};
