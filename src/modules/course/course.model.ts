import { model, Schema } from 'mongoose';
import { ICourse, ICourseDetails } from './course.interface';

// course details schema
const courseDetailsSchema = new Schema<ICourseDetails>({
    totalClasses: {
        type: Number,
    },
    totalLiveClasses: {
        type: Number,
    },
    totalLectures: {
        type: Number,
    },
    totalNotes: {
        type: Number,
    },
    totalExams: {
        type: Number,
    },
});

// course schema
const courseSchema = new Schema<ICourse>(
    {
        id: {
            type: String,
            required: [true, 'Course ID is required'],
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        code: {
            type: String,
            required: [true, 'Code is required'],
        },
        typeCode: {
            type: String,
            required: [true, 'Type code is required'],
        },
        shortDescription: {
            type: String,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        type: {
            type: String,
            enum: {
                values: ['Online', 'Offline'],
                message: '{VALUE} is invalid type',
            },
            required: [true, 'Type is required'],
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'CourseCategory',
            required: [true, 'Category is required'],
        },
        teachers: {
            type: [Schema.Types.ObjectId],
            ref: 'Admin',
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
        },
        offerPrice: {
            type: Number,
        },
        details: {
            type: courseDetailsSchema,
        },
        status: {
            type: String,
            enum: {
                values: ['Active', 'Inactive'],
                message: '{VALUE} is invalid status',
            },
            default: 'Active',
        },
        trailer: {
            type: String,
        },
        duration: {
            type: [String],
            validate: {
                validator: arr => arr.length === 2,
                message: 'Invalid duration',
            },
            required: [true, 'Duration is required'],
        },
        expiredTime: {
            type: [Schema.Types.Mixed],
            validate: {
                validator: arr =>
                    Array.isArray(arr) &&
                    arr.length === 2 &&
                    typeof arr[0] === 'number' &&
                    typeof arr[1] === 'string',
                message: 'Invalid expired time',
            },
            required: [true, 'Expired time is required'],
        },
        reviewed: {
            type: Boolean,
            default: false,
        },
        routine: {
            type: String,
        },
        routinePDF: {
            type: String,
        },
        image: {
            type: String,
            required: [true, 'Image is required'],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

// course model
export const Course = model<ICourse>('Course', courseSchema);
