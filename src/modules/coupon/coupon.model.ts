import { model, Schema } from 'mongoose';
import { ICoupon } from './coupon.interface';

const discountSchema = new Schema({
    type: {
        type: String,
        enum: {
            values: ['Fixed', 'Percentage'],
            message: '{VALUE} is invalid status',
        },
        required: [true, 'Discount type is required'],
    },
    amount: {
        type: Number,
        required: [true, 'Discount amount is required'],
    },
});

const couponSchema = new Schema<ICoupon>(
    {
        id: {
            type: String,
            required: [true, 'User ID is required'],
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            unique: true,
        },
        discount: {
            type: discountSchema,
            required: [true, 'Address is required'],
        },
        issuedAt: {
            type: Date,
            required: [true, 'IssuedAt is required'],
        },
        expiredAt: {
            type: Date,
            required: [true, 'ExpiredAt is required'],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export const Coupon = model<ICoupon>('Coupon', couponSchema);
