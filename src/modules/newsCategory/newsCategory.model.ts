import { model, Schema } from 'mongoose';
import { INewsCategory } from './newsCategory.interface';

// news category schema
const newsCategorySchema = new Schema<INewsCategory>(
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

// news category model
export const NewsCategory = model<INewsCategory>(
    'NewsCategory',
    newsCategorySchema,
);
