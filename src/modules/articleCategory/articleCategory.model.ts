import { model, Schema } from 'mongoose';
import { IArticleCategory } from './articleCategory.interface';

// article category schema
const articleCategorySchema = new Schema<IArticleCategory>(
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
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

// article category model
export const ArticleCategory = model<IArticleCategory>(
    'ArticleCategory',
    articleCategorySchema,
);
