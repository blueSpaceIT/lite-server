import httpStatus from 'http-status';
import { IBranch } from './branch.interface';
import { Branch } from './branch.model';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import generateID from '../../utils/generateID';

// create branch
const createBranchIntoDB = async (payload: IBranch) => {
    const createBranchData = {
        ...payload,
    };
    createBranchData.id = await generateID(Branch);

    const result = await Branch.create(createBranchData);
    return result;
};

// get all branches
const getAllBranchesFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        Branch.find({ isDeleted: false }),
        query,
    )
        .search(['name', 'address'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return { result, meta };
};

// get single branch
const getSingleBranchFromDB = async (id: string) => {
    const result = await Branch.findOne({ id, isDeleted: false });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No branch found');
    }
    return result;
};

// update branch
const updateBranchIntoDB = async (id: string, payload: Partial<IBranch>) => {
    const branch = await Branch.findOne({ id, isDeleted: false });
    if (!branch) {
        throw new AppError(httpStatus.NOT_FOUND, 'No branch found');
    }

    if (payload?.name && payload.name === '') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Name cannot be empty');
    }

    if (payload?.address && payload.address === '') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Address cannot be empty');
    }

    const updatedBranchData = {
        ...payload,
    };

    const result = await Branch.findByIdAndUpdate(
        branch._id,
        updatedBranchData,
        { new: true },
    );
    return result;
};

// delete branch
const deleteBranchFromDB = async (id: string) => {
    const branch = await Branch.findOne({ id, isDeleted: false });
    if (!branch) {
        throw new AppError(httpStatus.NOT_FOUND, 'No branch found');
    }

    const result = await Branch.findByIdAndUpdate(
        branch._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const BranchServices = {
    createBranchIntoDB,
    getAllBranchesFromDB,
    getSingleBranchFromDB,
    updateBranchIntoDB,
    deleteBranchFromDB,
};
