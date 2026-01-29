import { model, Schema } from 'mongoose';
import { IPaymentDetails, IPurchase } from './purchase.interface';

const paymentDetailsSchema = new Schema<IPaymentDetails>({
    method: {
        type: String,
        enum: ['Cash', 'SSLCommerz', 'Bkash', 'Nagad', 'Rocket'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    account: {
        type: String,
    },
    trxID: {
        type: String,
    },
    paidAt: {
        type: Date,
        default: Date.now,
    },
});

const purchaseSchema = new Schema<IPurchase>(
    {
        id: {
            type: String,
        },
        student: {
            type: Schema.Types.ObjectId,
            required: [true, 'Student is required'],
            ref: 'Student',
        },
        course: {
            type: Schema.Types.ObjectId,
            required: [true, 'Course is required'],
            ref: 'Course',
        },
        batch: {
            type: Schema.Types.ObjectId,
            ref: 'Batch',
        },
        branch: {
            type: Schema.Types.ObjectId,
            required: [true, 'Branch is required'],
            ref: 'Branch',
        },
        status: {
            type: String,
            enum: {
                values: ['Active', 'Pending', 'Course Out'],
                message: '{VALUE} is invalid status',
            },
            default: 'Pending',
        },
        payStatus: {
            type: String,
            enum: {
                values: ['Paid', 'Pending', 'Partial', 'Refunded'],
                message: '{VALUE} is invalid pay status',
            },
            default: 'Pending',
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
        },
        subtotal: {
            type: Number,
            required: [true, 'Subtotal is required'],
        },
        discount: {
            type: Number,
            default: 0,
        },
        totalAmount: {
            type: Number,
            required: [true, 'Total amount is required'],
        },
        paidAmount: {
            type: Number,
            default: 0,
        },
        paymentDetails: {
            type: [paymentDetailsSchema],
        },
        dueDate: {
            type: Date,
        },
        discountReason: {
            type: String,
        },
        coupon: {
            type: Schema.Types.ObjectId,
            ref: 'Coupon',
        },
        expiredAt: {
            type: Date,
            required: [true, 'Expired at is required'],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export const Purchase = model<IPurchase>('Purchase', purchaseSchema);
