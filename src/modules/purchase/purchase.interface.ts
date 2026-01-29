import { Types } from 'mongoose';

export interface IPaymentDetails {
    method: 'Cash' | 'SSLCommerz' | 'Bkash' | 'Nagad' | 'Rocket';
    amount: number;
    account?: string;
    trxID?: string;
    paidAt?: Date;
}

export interface IPurchase {
    id: string;
    student: Types.ObjectId;
    course: Types.ObjectId;
    batch?: Types.ObjectId;
    branch: Types.ObjectId;
    status: 'Active' | 'Pending' | 'Course Out';
    payStatus: 'Paid' | 'Pending' | 'Partial' | 'Refunded';
    price: number;
    subtotal: number;
    discount: number;
    totalAmount: number;
    paidAmount: number;
    paymentDetails?: IPaymentDetails[];
    dueDate?: Date;
    discountReason?: string;
    coupon?: Types.ObjectId;
    expiredAt: Date;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICreatePurchase {
    name: string;
    phone: string;
    course: string;
    batch?: string;
    branch: string;
    price: number;
    coupon?: string;
    discountReason?: string;
    discount?: number;
    status?: 'Active' | 'Pending' | 'Course Out';
    paymentDetails?: IPaymentDetails[];
    dueDate?: Date;
}

export interface IUpdatePurchase {
    paymentDetails?: IPaymentDetails;
    dueDate?: Date;
}
