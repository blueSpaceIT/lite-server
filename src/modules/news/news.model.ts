import { model, Schema } from 'mongoose';
import { INews } from './news.interface';

// news schema
const newsSchema = new Schema<INews>(
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
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        category: {
            type: Schema.Types.ObjectId,
            required: [true, 'Category is required'],
            ref: 'NewsCategory',
        },
        tags: {
            type: [String],
        },
        status: {
            type: String,
            enum: {
                values: ['Active', 'Inactive'],
                message: '{VALUE} is invalid status',
            },
            default: 'Active',
        },
        image: {
            type: String,
            required: [true, 'Image is required'],
        },
        author: {
            type: Schema.Types.ObjectId,
            required: [true, 'Author is required'],
            ref: 'Admin',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

// news model
export const News = model<INews>('News', newsSchema);
