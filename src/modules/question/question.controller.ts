import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { QuestionServices } from './question.service';

// create question controller
const createQuestion = catchAsync(async (req, res) => {
    const result = await QuestionServices.createQuestionIntoDB(
        req.user,
        req.body,
    );
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Question has been created successfully',
        data: result,
    });
});

// get all questions controller
const getAllQuestions = catchAsync(async (req, res) => {
    const result = await QuestionServices.getAllQuestionsFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All questions have been retrieved successfully',
        data: result,
    });
});

// get all questions by tags controller
const getAllQuestionsByTags = catchAsync(async (req, res) => {
    const result = await QuestionServices.getAllQuestionsByTagsFromDB(
        req.query,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All questions have been retrieved successfully',
        data: result,
    });
});

// get all questions by tags in depth controller
const getAllQuestionsByTagsInDepth = catchAsync(async (req, res) => {
    const result = await QuestionServices.getAllQuestionsByTagsInDepthFromDB(
        req.query,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All questions have been retrieved successfully',
        data: result,
    });
});

// get single question controller
const getSingleQuestion = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await QuestionServices.getSingleQuestionFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Question has been retrieved successfully',
        data: result,
    });
});

// update question controller
const updateQuestion = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await QuestionServices.updateQuestionIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Question has been updated successfully',
        data: result,
    });
});

// delete question controller
const deleteQuestion = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await QuestionServices.deleteQuestionFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Question has been deleted successfully',
        data: result,
    });
});

export const QuestionControllers = {
    createQuestion,
    getAllQuestions,
    getAllQuestionsByTags,
    getAllQuestionsByTagsInDepth,
    getSingleQuestion,
    updateQuestion,
    deleteQuestion,
};
