import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';

// create admin controller
const createAdmin = catchAsync(async (req, res) => {
    const result = await AdminServices.createAdminIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Admin has been created successfully',
        data: result,
    });
});

// get all admins controller
const getAllAdmins = catchAsync(async (req, res) => {
    const result = await AdminServices.getAllAdminsFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All users have been retrieved successfully',
        data: result,
    });
});

// get all deleted admins controller
const getAllDeletedAdmins = catchAsync(async (req, res) => {
    const result = await AdminServices.getAllDeletedAdminsFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All deleted users have been retrieved successfully',
        data: result,
    });
});

// get teams controller
const getTeams = catchAsync(async (req, res) => {
    const result = await AdminServices.getTeamsFromDB();
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Teams have been retrieved successfully',
        data: result,
    });
});

// get single admin controller
const getSingleAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminServices.getSinglAdminFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Admin has been retrieved successfully',
        data: result,
    });
});

// update admin controller
const updateAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminServices.updateAdminIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Admin has been updated successfully',
        data: result,
    });
});

// update admin password controller
const updateAdminPassword = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminServices.updateAdminPasswordIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Admin password has been updated successfully',
        data: result,
    });
});

// delete admin controller
const deleteAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminServices.deleteAdminFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Admin has been deleted successfully',
        data: result,
    });
});

// delete permanent admin controller
const deletePermanentAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminServices.deletePermanentAdminFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Admin has been deleted successfully',
        data: result,
    });
});

export const AdminControllers = {
    createAdmin,
    getAllAdmins,
    getAllDeletedAdmins,
    getTeams,
    getSingleAdmin,
    updateAdmin,
    updateAdminPassword,
    deleteAdmin,
    deletePermanentAdmin,
};
