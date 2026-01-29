import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TagServices } from './tag.service';

const createTag = catchAsync(async (req, res) => {
    const result = await TagServices.createTagIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Tag has been created successfully',
        data: result,
    });
});

const getAllTags = catchAsync(async (req, res) => {
    const result = await TagServices.getAllTagsFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Tags have been retrieved successfully',
        data: result,
    });
});

const getSingleTag = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await TagServices.getSingleTagFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Tag has been retrieved successfully',
        data: result,
    });
});

const updateTag = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await TagServices.updateTagIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Tag has been updated successfully',
        data: result,
    });
});

const deleteTag = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await TagServices.deleteTagFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Tag has been deleted successfully',
        data: result,
    });
});

export const TagControllers = {
    createTag,
    getAllTags,
    getSingleTag,
    updateTag,
    deleteTag,
};
