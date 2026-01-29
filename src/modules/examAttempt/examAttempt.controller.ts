import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { ExamAttemptServices } from './examAttempt.service';
import sendResponse from '../../utils/sendResponse';

// create mcq exam attempt controller
const createMCQExamAttempt = catchAsync(async (req, res) => {
    const result = await ExamAttemptServices.createMCQExamAttemptIntoDB(
        req.body,
        req.user,
    );
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Exam attempt has been created successfully',
        data: result,
    });
});

// create cq exam attempt controller
const createCQExamAttempt = catchAsync(async (req, res) => {
    const result = await ExamAttemptServices.createCQExamAttemptIntoDB(
        req.body,
        req.user,
    );
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Exam attempt has been created successfully',
        data: result,
    });
});

// get exam attempts controller
const getExamAttempts = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ExamAttemptServices.getExamAttemptsFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Exam attempts have been retrieved successfully',
        data: result,
    });
});

// get exam attempts on admin controller
const getExamAttemptsOnAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ExamAttemptServices.getExamAttemptsOnAdminFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Exam attempts have been retrieved successfully',
        data: result,
    });
});

// get exam attempt controller
const getExamAttempt = catchAsync(async (req, res) => {
    const { userID, examID } = req.params;
    const result = await ExamAttemptServices.getExamAttemptFromDB(
        userID,
        examID,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Exam attempt has been retrieved successfully',
        data: result,
    });
});

// update cq mark controller
const updateCQMark = catchAsync(async (req, res) => {
    const { userID, examID } = req.params;
    const result = await ExamAttemptServices.updateCQMarkIntoDB(
        userID,
        examID,
        req.body,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Exam attempt has been updated successfully',
        data: result,
    });
});

export const ExamAttemptControllers = {
    createMCQExamAttempt,
    createCQExamAttempt,
    getExamAttempts,
    getExamAttemptsOnAdmin,
    getExamAttempt,
    updateCQMark,
};
