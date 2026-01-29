import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';

// create student controller
const createStudent = catchAsync(async (req, res) => {
    const result = await StudentServices.createStudentIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Student has been created successfully',
        data: result,
    });
});

// upsert student controller
const upsertStudent = catchAsync(async (req, res) => {
    const result = await StudentServices.upsertStudentIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Student has been created successfully',
        data: result,
    });
});

// get all students controller
const getAllStudents = catchAsync(async (req, res) => {
    const result = await StudentServices.getAllStudentsFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All students have been retrieved successfully',
        data: result,
    });
});

// get single student controller
const getSingleStudent = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Student has been retrieved successfully',
        data: result,
    });
});

// get single student by phone controller
const getSingleStudentByPhone = catchAsync(async (req, res) => {
    const { phone } = req.params;
    const result = await StudentServices.getSingleStudentByPhoneFromDB(phone);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Student has been retrieved successfully',
        data: result,
    });
});

// update student controller
const updateStudent = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await StudentServices.updateStudentIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Student has been updated successfully',
        data: result,
    });
});

// update student password controller
const updateStudentPassword = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await StudentServices.updateStudentPasswordIntoDB(
        id,
        req.body,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Student password has been updated successfully',
        data: result,
    });
});

// delete student controller
const deleteStudent = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await StudentServices.deleteStudentFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Student has been deleted successfully',
        data: result,
    });
});

export const StudentControllers = {
    createStudent,
    upsertStudent,
    getAllStudents,
    getSingleStudent,
    getSingleStudentByPhone,
    updateStudent,
    updateStudentPassword,
    deleteStudent,
};
