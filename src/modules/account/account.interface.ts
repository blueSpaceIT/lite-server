import { Types } from 'mongoose';

export interface IAccount {
    id: string;
    type: 'Earning' | 'Expense';
    reason: string[];
    method: 'Cash' | 'SSLCommerz' | 'Bank' | 'Bkash' | 'Nagad' | 'Rocket';
    amount: number;
    branch: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
