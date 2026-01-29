import { model, Schema } from 'mongoose';
import { IStudentAuth } from './auth.interface';

// student auth schema
const studentAuthSchema = new Schema<IStudentAuth>(
    {
        student: {
            type: Schema.Types.ObjectId,
            required: [true, 'Student ID is required'],
            unique: true,
            ref: 'Student',
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            unique: true,
        },
        ipAddress: {
            type: String,
            required: [true, 'IP address is required'],
        },
        deviceType: {
            type: String,
            required: [true, 'Device type is required'],
        },
        deviceName: {
            type: String,
            required: [true, 'Device name is required'],
        },
    },
    { timestamps: true },
);

// student auth model
export const StudentAuth = model<IStudentAuth>(
    'StudentAuth',
    studentAuthSchema,
);
