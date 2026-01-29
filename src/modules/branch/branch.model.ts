import { model, Schema } from 'mongoose';
import { IBranch } from './branch.interface';

const branchSchema = new Schema<IBranch>(
    {
        id: {
            type: String,
            required: [true, 'User ID is required'],
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        code: {
            type: String,
            required: [true, 'Code is required'],
            unique: true,
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        mapURL: {
            type: String,
        },
        status: {
            type: String,
            enum: {
                values: ['Active', 'Inactive'],
                message: '{VALUE} is invalid status',
            },
            default: 'Active',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export const Branch = model<IBranch>('Branch', branchSchema);
