import { model, Schema } from 'mongoose';
import { IArticle } from './article.interface';

// article schema
const articleSchema = new Schema<IArticle>(
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
            ref: 'ArticleCategory',
        },
        tags: {
            type: [String],
        },
        featured: {
            type: Boolean,
            default: false,
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

// article model
export const Article = model<IArticle>('Article', articleSchema);
