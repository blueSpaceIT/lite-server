import { model, Schema } from 'mongoose';
import { ICourseReview } from './courseReview.interface';

const courseReviewSchema = new Schema<ICourseReview>(
    {
        id: {
            type: String,
            required: [true, 'Batch ID is required'],
            unique: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course is required'],
        },
        student: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: [true, 'Student is required'],
        },
        status: {
            type: String,
            enum: {
                values: ['Approved', 'Pending', 'Rejected'],
                message: '{VALUE} is invalid status',
            },
            default: 'Pending',
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
        },
        comment: {
            type: String,
            required: [true, 'Comment is required'],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export const CourseReview = model<ICourseReview>(
    'CourseReview',
    courseReviewSchema,
);
