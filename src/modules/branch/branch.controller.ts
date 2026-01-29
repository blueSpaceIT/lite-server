import httpStatus from 'http-status';
import { BranchServices } from './branch.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

// create branch controller
const createBranch = catchAsync(async (req, res) => {
    const result = await BranchServices.createBranchIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Branch has been created successfully',
        data: result,
    });
});

// get all branches controller
const getAllBranches = catchAsync(async (req, res) => {
    const result = await BranchServices.getAllBranchesFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All branches have been retrieved successfully',
        data: result,
    });
});

// get single branch controller
const getSingleBranch = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BranchServices.getSingleBranchFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Branch has been retrieved successfully',
        data: result,
    });
});

// update branch controller
const updateBranch = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BranchServices.updateBranchIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Branch has been updated successfully',
        data: result,
    });
});

// delete branch controller
const deleteBranch = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BranchServices.deleteBranchFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Branch has been deleted successfully',
        data: result,
    });
});

export const BranchControllers = {
    createBranch,
    getAllBranches,
    getSingleBranch,
    updateBranch,
    deleteBranch,
};
