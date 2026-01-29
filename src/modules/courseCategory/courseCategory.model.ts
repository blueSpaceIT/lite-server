import { model, Schema } from 'mongoose';
import { ICourseCategory } from './courseCategory.interface';

// course category schema
const courseCategorySchema = new Schema<ICourseCategory>(
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

// course category model
export const CourseCategory = model<ICourseCategory>(
    'CourseCategory',
    courseCategorySchema,
);
