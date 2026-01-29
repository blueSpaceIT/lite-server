import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseCategoryServices } from './courseCategory.service';

// create course category controller
const createCourseCategory = catchAsync(async (req, res) => {
    const result = await CourseCategoryServices.createCourseCategoryIntoDB(
        req.body,
    );
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Course category has been created successfully',
        data: result,
    });
});

// get all course categories controller
const getAllCourseCategories = catchAsync(async (req, res) => {
    const result = await CourseCategoryServices.getAllCourseCategoriesFromDB(
        req.query,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All course categories have been retrieved successfully',
        data: result,
    });
});

// get single course category controller
const getSingleCourseCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result =
        await CourseCategoryServices.getSingleCourseCategoryFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Course category has been retrieved successfully',
        data: result,
    });
});

// update course category controller
const updateCourseCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseCategoryServices.updateCourseCategoryIntoDB(
        id,
        req.body,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Course category has been updated successfully',
        data: result,
    });
});

// delete course category controller
const deleteCourseCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseCategoryServices.deleteCourseCategoryFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Course category has been deleted successfully',
        data: result,
    });
});

export const CourseCategoryControllers = {
    createCourseCategory,
    getAllCourseCategories,
    getSingleCourseCategory,
    updateCourseCategory,
    deleteCourseCategory,
};
