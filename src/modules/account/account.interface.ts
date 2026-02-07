import { Types } from 'mongoose';

export interface IAccount {
    id: string;
    type: 'Earning' | 'Expense';
    reason: string[];
    method: 'Cash' | 'SSLCommerz' | 'Bkash' | 'Nagad' | 'Rocket' | 'PayStation';
    amount: number;
    branch: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
