import httpStatus from 'http-status';
import generateID from '../../utils/generateID';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { IBatch } from './batch.interface';
import { Batch } from './batch.model';
import { Course } from '../course/course.model';
import { Branch } from '../branch/branch.model';

// create batch
const createBatchIntoDB = async (payload: IBatch) => {
    // check course
    const course = await Course.findOne({
        id: payload.course,
        isDeleted: false,
    }).select('_id');
    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course found');
    }

    // check branch
    const branch = await Branch.findOne({
        id: payload.branch,
        isDeleted: false,
    }).select('_id');
    if (!branch) {
        throw new AppError(httpStatus.NOT_FOUND, 'No branch found');
    }

    // create batch data
    const createBatchData = {
        ...payload,
    };
    createBatchData.id = await generateID(Batch);
    createBatchData.course = course._id;
    createBatchData.branch = branch._id;

    const result = await Batch.create(createBatchData);
    return result;
};

// get all batches
const getAllBatchesFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        Batch.find({ isDeleted: false })
            .populate('course', '_id id name')
            .populate('branch', '_id id name'),
        query,
    )
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return { result, meta };
};

// get single batch
const getSingleBatchFromDB = async (id: string) => {
    const result = await Batch.findOne({ id, isDeleted: false })
        .populate('course', '_id id name')
        .populate('branch', '_id id name');
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No batch found');
    }
    return result;
};

// update batch
const updateBatchIntoDB = async (id: string, payload: Partial<IBatch>) => {
    const batch = await Batch.findOne({ id, isDeleted: false });
    if (!batch) {
        throw new AppError(httpStatus.NOT_FOUND, 'No batch found');
    }

    if (payload?.name && payload.name === '') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Name cannot be empty');
    }

    const updatedBatchData = {
        ...payload,
    };
    if (payload?.course) {
        const course = await Course.findOne({
            id: payload.course,
            isDeleted: false,
        }).select('_id');
        if (!course) {
            throw new AppError(httpStatus.NOT_FOUND, 'No course found');
        }
        updatedBatchData.course = course._id;
    }
    if (payload?.branch) {
        const branch = await Branch.findOne({
            id: payload.branch,
            isDeleted: false,
        }).select('_id');
        if (!branch) {
            throw new AppError(httpStatus.NOT_FOUND, 'No branch found');
        }
        updatedBatchData.branch = branch._id;
    }

    const result = await Batch.findByIdAndUpdate(batch._id, updatedBatchData, {
        new: true,
    });
    return result;
};

// delete batch
const deleteBatchFromDB = async (id: string) => {
    const batch = await Batch.findOne({
        id,
        isDeleted: false,
    });
    if (!batch) {
        throw new AppError(httpStatus.NOT_FOUND, 'No batch found');
    }

    const result = await Batch.findByIdAndUpdate(
        batch._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const BatchServices = {
    createBatchIntoDB,
    getAllBatchesFromDB,
    getSingleBatchFromDB,
    updateBatchIntoDB,
    deleteBatchFromDB,
};
