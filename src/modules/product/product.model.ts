import { model, Schema } from 'mongoose';
import { IProduct, IProductDescription } from './product.interface';

const descriptionTupleSchema = new Schema<IProductDescription>(
    {
        key: { type: String, required: true },
        value: { type: String, required: true },
    },
    { _id: false },
);

const productSchema = new Schema<IProduct>(
    {
        id: {
            type: String,
            required: [true, 'Product ID is required'],
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        shortDescription: {
            type: String,
        },
        description: {
            type: [descriptionTupleSchema],
            required: [true, 'Description is required'],
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'ProductCategory',
            required: [true, 'Category is required'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
        },
        offerPrice: {
            type: Number,
        },
        stock: {
            type: String,
            enum: {
                values: ['In stock', 'Stock out'],
                message: '{VALUE} is invalid status',
            },
            required: [true, 'Stock is required'],
        },
        status: {
            type: String,
            enum: {
                values: ['Active', 'Inactive'],
                message: '{VALUE} is invalid status',
            },
            default: 'Active',
        },
        isBestSelling: {
            type: Boolean,
            default: false,
        },
        isPopular: {
            type: Boolean,
            default: false,
        },
        image: {
            type: String,
            required: [true, 'Image is required'],
        },
        fullPDF: {
            type: String,
        },
        shortPDF: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export const Product = model<IProduct>('Product', productSchema);
