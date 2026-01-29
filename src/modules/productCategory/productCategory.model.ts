import { model, Schema } from 'mongoose';
import { IProductCategory } from './productCategory.interface';

// product category schema
const productCategorySchema = new Schema<IProductCategory>(
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

// product category model
export const ProductCategory = model<IProductCategory>(
    'ProductCategory',
    productCategorySchema,
);
