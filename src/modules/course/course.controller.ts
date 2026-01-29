import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';

// create course controller
const createCourse = catchAsync(async (req, res) => {
    const result = await CourseServices.createCourseIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Course has been created successfully',
        data: result,
    });
});

// get all courses controller
const getAllCourses = catchAsync(async (req, res) => {
    const result = await CourseServices.getAllCoursesFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All courses have been retrieved successfully',
        data: result,
    });
});

// get all free courses controller
const getAllFreeCourses = catchAsync(async (req, res) => {
    const result = await CourseServices.getAllFreeCoursesFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All courses have been retrieved successfully',
        data: result,
    });
});

// get single course controller
const getSingleCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.getSingleCourseFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Course has been retrieved successfully',
        data: result,
    });
});

// update course controller
const updateCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.updateCourseIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Course has been updated successfully',
        data: result,
    });
});

// update course details controller
const updateCourseDetails = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.updateCourseDetailsIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Course has been updated successfully',
        data: result,
    });
});

// delete course controller
const deleteCourse = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseServices.deleteCourseFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Course has been deleted successfully',
        data: result,
    });
});

export const CourseControllers = {
    createCourse,
    getAllCourses,
    getAllFreeCourses,
    getSingleCourse,
    updateCourse,
    updateCourseDetails,
    deleteCourse,
};
