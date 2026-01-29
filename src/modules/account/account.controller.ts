import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AccountServices } from './account.service';

// create account controller
const createAccount = catchAsync(async (req, res) => {
    const result = await AccountServices.createAccountIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Account has been created successfully',
        data: result,
    });
});

// get all accounts controller
const getAllAccounts = catchAsync(async (req, res) => {
    const result = await AccountServices.getAllAccountsFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All accounts have been retrieved successfully',
        data: result,
    });
});

// get single account controller
const getSingleAccount = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AccountServices.getSingleAccountFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Account has been retrieved successfully',
        data: result,
    });
});

// get account summary by branch controller
const getAccountSummaryByBranch = catchAsync(async (req, res) => {
    const { id, startDate, endDate } = req.params;
    const result = await AccountServices.getAccountSummaryByBranchFromDB(
        id,
        startDate,
        endDate,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Account has been retrieved successfully',
        data: result,
    });
});

// get account summary for admin controller
const getAccountSummaryForAdmin = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.params;
    const result = await AccountServices.getAccountSummaryForAdminFromDB(
        startDate,
        endDate,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Account has been retrieved successfully',
        data: result,
    });
});

// get account year summary for admin controller
const getAccountYearSummaryForAdmin = catchAsync(async (req, res) => {
    const { year } = req.params;
    const result =
        await AccountServices.getAccountYearSummaryForAdminFromDB(year);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Account has been retrieved successfully',
        data: result,
    });
});

// update account controller
const updateAccount = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AccountServices.updateAccountIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Account has been updated successfully',
        data: result,
    });
});

// delete account controller
const deleteAccount = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AccountServices.deleteAccountFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Account has been deleted successfully',
        data: result,
    });
});

export const AccountControllers = {
    createAccount,
    getAllAccounts,
    getSingleAccount,
    getAccountSummaryByBranch,
    getAccountSummaryForAdmin,
    getAccountYearSummaryForAdmin,
    updateAccount,
    deleteAccount,
};
