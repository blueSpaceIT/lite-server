import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BatchServices } from './batch.service';

// create batch controller
const createBatch = catchAsync(async (req, res) => {
    const result = await BatchServices.createBatchIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Batch has been created successfully',
        data: result,
    });
});

// get all batches controller
const getAllBatches = catchAsync(async (req, res) => {
    const result = await BatchServices.getAllBatchesFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All batches have been retrieved successfully',
        data: result,
    });
});

// get single batch controller
const getSingleBatch = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BatchServices.getSingleBatchFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Batch has been retrieved successfully',
        data: result,
    });
});

// update batch controller
const updateBatch = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BatchServices.updateBatchIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Batch has been updated successfully',
        data: result,
    });
});

// delete batch controller
const deleteBatch = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BatchServices.deleteBatchFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Batch has been deleted successfully',
        data: result,
    });
});

export const BatchControllers = {
    createBatch,
    getAllBatches,
    getSingleBatch,
    updateBatch,
    deleteBatch,
};
