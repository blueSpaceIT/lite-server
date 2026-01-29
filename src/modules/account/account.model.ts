import { model, Schema } from 'mongoose';
import { IAccount } from './account.interface';

const accountSchema = new Schema<IAccount>(
    {
        id: {
            type: String,
            required: [true, 'Account ID is required'],
            unique: true,
        },
        type: {
            type: String,
            enum: ['Earning', 'Expense'],
            required: [true, 'Type is required'],
        },
        reason: {
            type: [String],
            required: [true, 'Reason is required'],
        },
        method: {
            type: String,
            enum: {
                values: [
                    'Cash',
                    'SSLCommerz',
                    'Bank',
                    'Bkash',
                    'Nagad',
                    'Rocket',
                ],
                message: '{VALUE} is invalid method',
            },
            required: [true, 'Method is required'],
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
        },
        branch: {
            type: Schema.Types.ObjectId,
            ref: 'Branch',
            required: [true, 'Branch is required'],
        },
    },
    { timestamps: true },
);

export const Account = model<IAccount>('Account', accountSchema);
