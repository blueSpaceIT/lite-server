import { Types } from 'mongoose';
import { IPaymentDetails } from '../purchase/purchase.interface';

export interface IOrderProduct {
    product: Types.ObjectId;
    price: number;
    quantity: number;
}

export interface IOrder {
    id: string;
    name: string;
    phone: string;
    orderType: 'hardcopy' | 'ebook';
    address?: string;
    area?: 'Dhaka' | 'Dhaka Out' | 'Office Pickup';
    status:
        | 'Pending'
        | 'On Hold'
        | 'Accepted'
        | 'Cancelled'
        | 'Out for delivery'
        | 'Delivered';
    payStatus: 'Paid' | 'Pending' | 'Refunded';
    payMethod: 'Cash On Delivery' | 'Payment Gateway';
    subtotal: number;
    discount?: number;
    deliveryCharge?: number;
    totalAmount: number;
    paidAmount: number;
    products: IOrderProduct[];
    paymentDetails?: IPaymentDetails[];
    discountReason?: string;
    coupon?: Types.ObjectId;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
