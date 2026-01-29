import { model, Schema } from 'mongoose';
import { IBatch } from './batch.interface';

const batchSchema = new Schema<IBatch>(
    {
        id: {
            type: String,
            required: [true, 'Batch ID is required'],
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course is required'],
        },
        branch: {
            type: Schema.Types.ObjectId,
            ref: 'Branch',
            required: [true, 'Branch is required'],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export const Batch = model<IBatch>('Batch', batchSchema);
