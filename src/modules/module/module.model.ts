import { model, Schema } from 'mongoose';
import { IModule } from './module.interface';

// module schema
const moduleSchema = new Schema<IModule>(
    {
        id: {
            type: String,
            required: [true, 'Module ID is required'],
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
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

// module model
export const Module = model<IModule>('Module', moduleSchema);
