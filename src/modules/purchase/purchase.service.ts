import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import {
    ICreatePurchase,
    IPurchase,
    IUpdatePurchase,
} from './purchase.interface';
import { Student } from '../student/student.model';
import { Course } from '../course/course.model';
import { Batch } from '../batch/batch.model';
import { Purchase } from './purchase.model';
import { Coupon } from '../coupon/coupon.model';
import generatePurchaseID from '../../utils/generatePurchaseID';
import getExpiryDate from '../../utils/getExpiryDate';
import { JwtPayload } from 'jsonwebtoken';
import { Branch } from '../branch/branch.model';
import { IAccount } from '../account/account.interface';
import { Account } from '../account/account.model';
import generateID from '../../utils/generateID';
import { INSTALLMENTS } from './purchase.constant';
import { Types } from 'mongoose';

// create purchase
const createPurchaseIntoDB = async (payload: ICreatePurchase) => {
    // check student
    const student = await Student.findOne({
        phone: payload.phone,
        isDeleted: false,
    }).select('_id');
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No student found');
    }

    // check course
    const course = await Course.findOne({
        id: payload.course,
        isDeleted: false,
    }).select('_id name code typeCode expiredTime');
    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course found');
    }

    // check branch
    const branch = await Branch.findOne({
        id: payload.branch,
        isDeleted: false,
    }).select('_id code');
    if (!branch) {
        throw new AppError(httpStatus.NOT_FOUND, 'No branch found');
    }

    const createPurchaseData: Partial<IPurchase> = {
        student: student._id,
        course: course._id,
        branch: branch._id,
        price: Number(payload.price),
        subtotal: Number(payload.price),
        totalAmount: Number(payload.price) - Number(payload?.discount || 0),
        expiredAt: getExpiryDate(course.expiredTime),
    };

    if (payload?.discount) {
        createPurchaseData.discount = payload.discount;
    }
    if (payload?.discountReason) {
        createPurchaseData.discountReason = payload.discountReason;
    }
    if (payload?.paymentDetails) {
        createPurchaseData.paymentDetails = payload.paymentDetails;
        createPurchaseData.paidAmount = payload.paymentDetails[0].amount;
        createPurchaseData.status = payload.status
            ? 'Active'
            : payload.paymentDetails?.length > 0
              ? 'Active'
              : 'Pending';

        createPurchaseData.payStatus =
            payload.paymentDetails[0].amount === createPurchaseData.totalAmount
                ? 'Paid'
                : payload.paymentDetails[0].amount <
                        Number(createPurchaseData.totalAmount) &&
                    payload.paymentDetails[0].amount > 0
                  ? 'Partial'
                  : 'Pending';
    }

    if (createPurchaseData.totalAmount === 0) {
        // check previous purchase
        const prevPurchase = await Purchase.findOne({
            student: student._id,
            course: course._id,
            status: 'Active',
            isDeleted: false,
        }).select('_id');
        if (prevPurchase) {
            throw new AppError(
                httpStatus.CONFLICT,
                'This course has been already purchased',
            );
        }

        createPurchaseData.paidAmount = 0;
        createPurchaseData.status = 'Active';
        createPurchaseData.payStatus = 'Paid';
    }

    if (payload?.batch) {
        // check batch
        const batch = await Batch.findOne({
            id: payload.batch,
            isDeleted: false,
        }).select('_id');
        if (!batch) {
            throw new AppError(httpStatus.NOT_FOUND, 'No batch found');
        }
        createPurchaseData.batch = batch._id;
    }

    if (payload?.coupon) {
        // check coupon
        const coupon = await Coupon.findOne({
            id: payload.coupon,
            isDeleted: false,
        }).select('_id');
        if (!coupon) {
            throw new AppError(httpStatus.NOT_FOUND, 'No coupon found');
        }
        createPurchaseData.coupon = coupon._id;
    }

    if (payload?.status) {
        createPurchaseData.status = payload.status;
    }

    if (payload?.dueDate) {
        createPurchaseData.dueDate = new Date(
            new Date(payload.dueDate).getTime(),
        );
    }

    if (createPurchaseData.status === 'Active') {
        createPurchaseData.id = await generatePurchaseID(branch, course);
    }

    const result = await Purchase.create(createPurchaseData);
    if (
        Number(createPurchaseData?.totalAmount) > 0 &&
        payload?.paymentDetails &&
        createPurchaseData.status === 'Active'
    ) {
        const createAccountData: Partial<IAccount> = {
            id: await generateID(Account),
            type: 'Earning',
            reason: [course.name],
            method: payload.paymentDetails[0].method,
            amount: Number(payload.paymentDetails[0].amount),
            branch: branch._id,
        };
        await Account.create(createAccountData);
    }
    return result;
};

// get all purchases
const getAllPurchasesFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        Purchase.find({ isDeleted: false })
            .populate('student', '_id id name phone image')
            .populate('course', '_id id name image')
            .populate('batch', '_id id name')
            .populate('branch', '_id id name')
            .populate('coupon', '_id id name'),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return { result, meta };
};

// get due purchases
const getDuePurchasesFromDB = async (query: Record<string, unknown>) => {
    const page = query?.page ? Number(query.page) : 1;
    const limit = query?.limit ? Number(query.limit) : 20;
    const branch = query?.branch;
    const now = new Date();
    const startDate = new Date(now);
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + 10);

    const filter: Record<string, unknown> = {
        $expr: {
            $gt: ['$totalAmount', '$paidAmount'],
        },
        dueDate: {
            $gte: startDate,
            $lte: endDate,
        },
        isDeleted: false,
    };

    if (branch) {
        filter.branch = new Types.ObjectId(String(branch));
    }

    const skip = (page - 1) * limit;

    const [result, totalDoc] = await Promise.all([
        Purchase.find(filter)
            .populate('course', '_id id name')
            .populate('batch', '_id id name')
            .populate('student', '_id id name phone')
            .skip(skip)
            .limit(limit)
            .sort({ dueDate: 1 }),
        Purchase.countDocuments(filter),
    ]);

    const totalPage = Math.ceil(totalDoc / limit);

    return {
        result,
        meta: {
            page,
            limit,
            totalPage,
            totalDoc,
        },
    };
};

// get all my purchases
const getAllMyPurchasesFromDB = async (
    userPayload: JwtPayload,
    query: Record<string, unknown>,
) => {
    // check student
    const student = await Student.findOne({
        id: userPayload.userID,
        isDeleted: false,
    }).select('_id');
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No student found');
    }

    const fetchQuery = new QueryBuilder(
        Purchase.find({
            student: student._id,
            status: 'Active',
            expiredAt: { $gte: new Date() },
            isDeleted: false,
        })
            .populate('course batch')
            .populate('branch', 'name')
            .populate('coupon', 'name'),
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

// get single purchase
const getSinglePurchaseFromDB = async (id: string) => {
    const result = await Purchase.findOne({ id, isDeleted: false }).populate(
        'student course batch branch coupon',
    );
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No purchase found');
    }
    return result;
};

// get single valid purchase
const getSingleValidPurchaseFromDB = async (
    userPayload: JwtPayload,
    courseID: string,
) => {
    // check student
    const student = await Student.findOne({
        id: userPayload.userID,
        isDeleted: false,
    }).select('_id');
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No student found');
    }

    // check course
    const course = await Course.findOne({
        id: courseID,
        isDeleted: false,
    }).select('_id');
    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course found');
    }

    const purchase = await Purchase.findOne({
        student: student._id,
        course: course._id,
        status: 'Active',
        expiredAt: { $gte: new Date() },
        isDeleted: false,
    })
        .populate('course batch')
        .populate('branch', 'name')
        .populate('coupon', 'name');
    if (!purchase) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'No valid purchase found for this course',
        );
    }

    return purchase;
};

// update purchase
const updatePurchaseIntoDB = async (id: string, payload: IUpdatePurchase) => {
    const purchase = await Purchase.findOne({ id, isDeleted: false }).populate<{
        course: { _id: string; name: string };
    }>('course', '_id name');
    if (!purchase) {
        throw new AppError(httpStatus.NOT_FOUND, 'No purchase found');
    }

    const updatedPurchaseData: Partial<IPurchase> = {};
    if (payload?.dueDate) {
        updatedPurchaseData.dueDate = new Date(
            new Date(payload.dueDate).getTime(),
        );
    }
    updatedPurchaseData.paymentDetails = [...(purchase?.paymentDetails || [])];
    if (payload?.paymentDetails) {
        updatedPurchaseData.paymentDetails.push(payload.paymentDetails);
    }
    const installment =
        INSTALLMENTS[updatedPurchaseData.paymentDetails.length - 1];
    const paidAmount = updatedPurchaseData.paymentDetails.reduce(
        (acc, curr) => acc + curr.amount,
        0,
    );
    updatedPurchaseData.paidAmount = paidAmount;
    updatedPurchaseData.payStatus =
        paidAmount === purchase.totalAmount ? 'Paid' : 'Partial';

    const result = await Purchase.findByIdAndUpdate(
        purchase._id,
        updatedPurchaseData,
        { new: true },
    );
    if (payload?.paymentDetails) {
        const createAccountData: Partial<IAccount> = {
            id: await generateID(Account),
            type: 'Earning',
            reason: [purchase.course.name + ` - ${installment} installment`],
            method: updatedPurchaseData.paymentDetails[
                updatedPurchaseData.paymentDetails.length - 1
            ].method,
            amount: Number(
                updatedPurchaseData.paymentDetails[
                    updatedPurchaseData.paymentDetails.length - 1
                ].amount,
            ),
            branch: purchase.branch,
        };
        await Account.create(createAccountData);
    }
    return result;
};

// delete purchase
const deletePurchaseFromDB = async (id: string) => {
    const purchase = await Purchase.findOne({ id, isDeleted: false }).select(
        '_id',
    );
    if (!purchase) {
        throw new AppError(httpStatus.NOT_FOUND, 'No purchase found');
    }

    const result = await Purchase.findByIdAndUpdate(
        purchase._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const PurchaseServices = {
    createPurchaseIntoDB,
    getAllPurchasesFromDB,
    getDuePurchasesFromDB,
    getAllMyPurchasesFromDB,
    getSinglePurchaseFromDB,
    getSingleValidPurchaseFromDB,
    updatePurchaseIntoDB,
    deletePurchaseFromDB,
};
