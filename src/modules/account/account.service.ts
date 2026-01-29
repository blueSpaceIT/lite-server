import httpStatus from 'http-status';
import generateID from '../../utils/generateID';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { IAccount } from './account.interface';
import { Account } from './account.model';
import { Branch } from '../branch/branch.model';

// create account
const createAccountIntoDB = async (payload: IAccount) => {
    // check branch
    const branch = await Branch.findOne({
        id: payload.branch,
        isDeleted: false,
    }).select('_id');
    if (!branch) {
        throw new AppError(httpStatus.NOT_FOUND, 'No branch found');
    }

    // create account data
    const createAccountData = {
        ...payload,
    };
    createAccountData.id = await generateID(Account);
    createAccountData.branch = branch._id;

    const result = await Account.create(createAccountData);
    return result;
};

// get all accounts
const getAllAccountsFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        Account.find().populate('branch', '_id id name'),
        query,
    )
        .filter()
        .sort()
        .fields();

    const result = await fetchQuery.modelQuery;
    return { result };
};

// get single account
const getSingleAccountFromDB = async (id: string) => {
    const result = await Account.findOne({ id }).populate(
        'branch',
        '_id id name',
    );
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No account found');
    }
    return result;
};

// get account summary by branch
const getAccountSummaryByBranchFromDB = async (
    branchID: string,
    startDate: string,
    endDate: string,
) => {
    // check branch
    const branch = await Branch.findOne({
        id: branchID,
        isDeleted: false,
    }).select('_id');
    if (!branch) {
        throw new AppError(httpStatus.NOT_FOUND, 'No branch found');
    }

    const result = await Account.aggregate([
        {
            $match: {
                branch: branch._id,
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
            },
        },
        {
            $group: {
                _id: {
                    method: '$method',
                    type: '$type',
                },
                totalAmount: { $sum: '$amount' },
            },
        },
        {
            $group: {
                _id: '$_id.method',
                earnings: {
                    $sum: {
                        $cond: [
                            { $eq: ['$_id.type', 'Earning'] },
                            '$totalAmount',
                            0,
                        ],
                    },
                },
                expenses: {
                    $sum: {
                        $cond: [
                            { $eq: ['$_id.type', 'Expense'] },
                            '$totalAmount',
                            0,
                        ],
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                method: '$_id',
                earning: '$earnings',
                expense: '$expenses',
            },
        },
        {
            $sort: { method: 1 },
        },
    ]);

    return result;
};

// get account summary for admin
const getAccountSummaryForAdminFromDB = async (
    startDate: string,
    endDate: string,
) => {
    const result = await Account.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
            },
        },
        {
            $group: {
                _id: {
                    branch: '$branch',
                    method: '$method',
                    type: '$type',
                },
                totalAmount: { $sum: '$amount' },
            },
        },
        {
            $group: {
                _id: {
                    branch: '$_id.branch',
                    method: '$_id.method',
                },
                earnings: {
                    $sum: {
                        $cond: [
                            { $eq: ['$_id.type', 'Earning'] },
                            '$totalAmount',
                            0,
                        ],
                    },
                },
                expenses: {
                    $sum: {
                        $cond: [
                            { $eq: ['$_id.type', 'Expense'] },
                            '$totalAmount',
                            0,
                        ],
                    },
                },
            },
        },
        {
            $lookup: {
                from: 'branches',
                localField: '_id.branch',
                foreignField: '_id',
                as: 'branch',
            },
        },
        {
            $unwind: '$branch',
        },
        {
            $project: {
                _id: 0,
                branch: {
                    _id: '$branch._id',
                    id: '$branch.id',
                    name: '$branch.name',
                },
                method: '$_id.method',
                earning: '$earnings',
                expense: '$expenses',
            },
        },
        {
            $sort: {
                'branch.name': 1,
                method: 1,
            },
        },
        {
            $group: {
                _id: '$branch',
                summary: {
                    $push: {
                        method: '$method',
                        earning: '$earning',
                        expense: '$expense',
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                branch: '$_id',
                summary: 1,
            },
        },
    ]);

    return result;
};

// get account year summary for admin
const getAccountYearSummaryForAdminFromDB = async (year: string) => {
    const MONTH_NAMES = [
        '',
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    const start = new Date(`${year}-01-01T00:00:00.000Z`);
    const end = new Date(`${year}-12-31T23:59:59.999Z`);

    const result = await Account.aggregate([
        {
            $match: {
                createdAt: { $gte: start, $lte: end },
            },
        },
        {
            $project: {
                branch: 1,
                type: 1,
                amount: 1,
                month: { $month: '$createdAt' },
            },
        },
        {
            $group: {
                _id: {
                    branch: '$branch',
                    month: '$month',
                    type: '$type',
                },
                totalAmount: { $sum: '$amount' },
            },
        },
        {
            $group: {
                _id: {
                    branch: '$_id.branch',
                    month: '$_id.month',
                },
                summary: {
                    $push: {
                        type: '$_id.type',
                        totalAmount: '$totalAmount',
                    },
                },
            },
        },
        {
            $lookup: {
                from: 'branches',
                localField: '_id.branch',
                foreignField: '_id',
                as: 'branch',
            },
        },
        {
            $unwind: '$branch',
        },
        {
            $project: {
                _id: 0,
                branch: '$branch',
                monthNumber: '$_id.month',
                month: {
                    $arrayElemAt: [MONTH_NAMES, '$_id.month'],
                },
                earning: {
                    $let: {
                        vars: {
                            data: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: '$summary',
                                            as: 's',
                                            cond: {
                                                $eq: ['$$s.type', 'Earning'],
                                            },
                                        },
                                    },
                                    0,
                                ],
                            },
                        },
                        in: '$$data.totalAmount',
                    },
                },
                expense: {
                    $let: {
                        vars: {
                            data: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: '$summary',
                                            as: 's',
                                            cond: {
                                                $eq: ['$$s.type', 'Expense'],
                                            },
                                        },
                                    },
                                    0,
                                ],
                            },
                        },
                        in: '$$data.totalAmount',
                    },
                },
            },
        },
        {
            $group: {
                _id: '$branch._id',
                branch: { $first: '$branch' },
                months: {
                    $push: {
                        monthNumber: '$monthNumber',
                        month: '$month',
                        earning: { $ifNull: ['$earning', 0] },
                        expense: { $ifNull: ['$expense', 0] },
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                branch: '$branch.name',
                months: {
                    $sortArray: {
                        input: '$months',
                        sortBy: { monthNumber: 1 },
                    },
                },
            },
        },
        { $sort: { branch: 1 } },
    ]);

    return result;
};

// update account
const updateAccountIntoDB = async (id: string, payload: Partial<IAccount>) => {
    const account = await Account.findOne({ id });
    if (!account) {
        throw new AppError(httpStatus.NOT_FOUND, 'No account found');
    }

    const updatedAccountData = {
        ...payload,
    };

    if (payload?.branch) {
        const branch = await Branch.findOne({
            id: payload.branch,
            isDeleted: false,
        }).select('_id');
        if (!branch) {
            throw new AppError(httpStatus.NOT_FOUND, 'No branch found');
        }
        updatedAccountData.branch = branch._id;
    }

    const result = await Account.findByIdAndUpdate(
        account._id,
        updatedAccountData,
        {
            new: true,
        },
    );
    return result;
};

// delete account
const deleteAccountFromDB = async (id: string) => {
    const account = await Account.findOne({ id });
    if (!account) {
        throw new AppError(httpStatus.NOT_FOUND, 'No account found');
    }

    const result = await Account.findByIdAndDelete(account._id);
    return result;
};

export const AccountServices = {
    createAccountIntoDB,
    getAllAccountsFromDB,
    getSingleAccountFromDB,
    getAccountSummaryByBranchFromDB,
    getAccountSummaryForAdminFromDB,
    getAccountYearSummaryForAdminFromDB,
    updateAccountIntoDB,
    deleteAccountFromDB,
};
