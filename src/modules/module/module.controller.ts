import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ModuleServices } from './module.service';

// create module controller
const createModule = catchAsync(async (req, res) => {
    const result = await ModuleServices.createModuleIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Module has been created successfully',
        data: result,
    });
});

// get all modules controller
const getAllModules = catchAsync(async (req, res) => {
    const result = await ModuleServices.getAllModulesFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All modules have been retrieved successfully',
        data: result,
    });
});

// get single module controller
const getSingleModule = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ModuleServices.getSingleModuleFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Module has been retrieved successfully',
        data: result,
    });
});

// update module controller
const updateModule = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ModuleServices.updateModuleIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Module has been updated successfully',
        data: result,
    });
});

// delete module controller
const deleteModule = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ModuleServices.deleteModuleFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Module has been deleted successfully',
        data: result,
    });
});

export const ModuleControllers = {
    createModule,
    getAllModules,
    getSingleModule,
    updateModule,
    deleteModule,
};
