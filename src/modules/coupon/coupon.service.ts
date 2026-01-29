import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import generateID from '../../utils/generateID';
import { ICoupon } from './coupon.interface';
import { Coupon } from './coupon.model';

// create coupon
const createCouponIntoDB = async (payload: ICoupon) => {
    const createCouponData = {
        ...payload,
    };
    createCouponData.id = await generateID(Coupon);

    const result = await Coupon.create(createCouponData);
    return result;
};

// get all coupons
const getAllCouponsFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        Coupon.find({ isDeleted: false }),
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

// get single coupon
const getSingleCouponFromDB = async (id: string) => {
    const result = await Coupon.findOne({ id, isDeleted: false });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No coupon found');
    }
    return result;
};

// get single coupon by name
const getSingleCouponByNameFromDB = async (name: string) => {
    const result = await Coupon.findOne({ name, isDeleted: false });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No coupon found');
    }
    return result;
};

// update coupon
const updateCouponIntoDB = async (id: string, payload: Partial<ICoupon>) => {
    const coupon = await Coupon.findOne({ id, isDeleted: false });
    if (!coupon) {
        throw new AppError(httpStatus.NOT_FOUND, 'No coupon found');
    }

    if (payload?.name && payload.name === '') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Name cannot be empty');
    }

    const updatedCouponData = {
        ...payload,
    };

    const result = await Coupon.findByIdAndUpdate(
        coupon._id,
        updatedCouponData,
        { new: true },
    );
    return result;
};

// delete coupon
const deleteCouponFromDB = async (id: string) => {
    const coupon = await Coupon.findOne({ id, isDeleted: false });
    if (!coupon) {
        throw new AppError(httpStatus.NOT_FOUND, 'No coupon found');
    }

    const result = await Coupon.findByIdAndUpdate(
        coupon._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const CouponServices = {
    createCouponIntoDB,
    getAllCouponsFromDB,
    getSingleCouponFromDB,
    getSingleCouponByNameFromDB,
    updateCouponIntoDB,
    deleteCouponFromDB,
};
