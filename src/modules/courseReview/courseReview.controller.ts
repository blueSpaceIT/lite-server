import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseReviewServices } from './courseReview.service';

// create course review controller
const createCourseReview = catchAsync(async (req, res) => {
    const result = await CourseReviewServices.createCourseReviewIntoDB(
        req.body,
    );
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Course review has been created successfully',
        data: result,
    });
});

// get all course reviews controller
const getAllCourseReviews = catchAsync(async (req, res) => {
    const result = await CourseReviewServices.getAllCourseReviewsFromDB(
        req.query,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All course reviews have been retrieved successfully',
        data: result,
    });
});

// get single course review controller
const getSingleCourseReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseReviewServices.getSingleCourseReviewFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Course review has been retrieved successfully',
        data: result,
    });
});

// get my course review controller
const getMyCourseReview = catchAsync(async (req, res) => {
    const { courseID } = req.params;
    const result = await CourseReviewServices.getMyCourseReviewFromDB(
        req.user,
        courseID,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Course review has been retrieved successfully',
        data: result,
    });
});

// update course review controller
const updateCourseReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseReviewServices.updateCourseReviewIntoDB(
        id,
        req.body,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Course review has been updated successfully',
        data: result,
    });
});

// delete course review controller
const deleteCourseReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseReviewServices.deleteCourseReviewFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Course review has been deleted successfully',
        data: result,
    });
});

export const CourseReviewControllers = {
    createCourseReview,
    getAllCourseReviews,
    getSingleCourseReview,
    getMyCourseReview,
    updateCourseReview,
    deleteCourseReview,
};
