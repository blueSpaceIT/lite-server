import { model, Schema } from 'mongoose';
import { IPaymentDetails } from '../purchase/purchase.interface';
import { IOrder, IOrderProduct } from './order.interface';

const orderProductSchema = new Schema<IOrderProduct>({
    product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

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

const orderSchema = new Schema<IOrder>(
    {
        id: {
            type: String,
            required: [true, 'Order ID is required'],
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
        },
        orderType: {
            type: String,
            enum: ['hardcopy', 'ebook'],
            required: [true, 'Order type is required'],
        },
        address: {
            type: String,
        },
        area: {
            type: String,
            enum: ['Dhaka', 'Dhaka Out', 'Office Pickup'],
        },
        status: {
            type: String,
            enum: {
                values: [
                    'Pending',
                    'On Hold',
                    'Accepted',
                    'Cancelled',
                    'Out for delivery',
                    'Delivered',
                ],
                message: '{VALUE} is invalid status',
            },
            default: 'Pending',
        },
        payStatus: {
            type: String,
            enum: {
                values: ['Paid', 'Pending', 'Refunded'],
                message: '{VALUE} is invalid pay status',
            },
            default: 'Pending',
        },
        payMethod: {
            type: String,
            enum: {
                values: ['Cash On Delivery', 'Payment Gateway'],
                message: '{VALUE} is invalid pay status',
            },
            required: [true, 'Pay method is required'],
        },
        subtotal: {
            type: Number,
            required: [true, 'Subtotal is required'],
        },
        discount: {
            type: Number,
            default: 0,
        },
        deliveryCharge: {
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
        products: {
            type: [orderProductSchema],
            required: [true, 'Products is required'],
        },
        paymentDetails: {
            type: [paymentDetailsSchema],
        },
        discountReason: {
            type: String,
        },
        coupon: {
            type: Schema.Types.ObjectId,
            ref: 'Coupon',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export const Order = model<IOrder>('Order', orderSchema);
