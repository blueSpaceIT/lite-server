import { model, Schema } from 'mongoose';
import { IGuardian, IStudent, IStudentModel } from './student.interface';

// guardian schema
const guardianSchema = new Schema<IGuardian>({
    name: {
        type: String,
    },
    phone: {
        type: String,
    },
});

// student schema
const studentSchema = new Schema<IStudent>(
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
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            select: 0,
        },
        otp: {
            type: String,
            required: [true, 'Otp is required'],
            select: 0,
        },
        nid: {
            type: String,
        },
        address: {
            type: String,
        },
        guardian: {
            type: guardianSchema,
        },
        school: {
            type: String,
        },
        college: {
            type: String,
        },
        university: {
            type: String,
        },
        department: {
            type: String,
        },
        district: {
            type: String,
        },
        role: {
            type: String,
            enum: {
                values: ['student'],
                message: '{VALUE} is invalid role',
            },
            default: 'student',
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

// student model static function (isStudentExistById)
studentSchema.statics.isStudentExistById = async function (id: string) {
    return await Student.findOne({ id });
};

// student model static function (isStudentExistByPhone)
studentSchema.statics.isStudentExistByPhone = async function (phone: string) {
    return await Student.findOne({ phone });
};

// student model
export const Student = model<IStudent, IStudentModel>('Student', studentSchema);
