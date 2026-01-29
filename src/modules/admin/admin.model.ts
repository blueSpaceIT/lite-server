import { model, Schema } from 'mongoose';
import { IAdmin, IAdminModel } from './admin.interface';
import { ADMIN_ROLES_ARRAY } from './admin.constant';

// admin schema
const adminSchema = new Schema<IAdmin>(
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
        branch: {
            type: Schema.Types.ObjectId,
            ref: 'Branch',
        },
        designation: {
            type: String,
            required: [true, 'Designation is required'],
        },
        quote: {
            type: String,
        },
        nid: {
            type: String,
        },
        address: {
            type: String,
        },
        role: {
            type: String,
            enum: {
                values: [...ADMIN_ROLES_ARRAY],
                message: '{VALUE} is invalid role',
            },
            required: [true, 'Role is required'],
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

// admin model static function (isAdminExistById)
adminSchema.statics.isAdminExistById = async function (id: string) {
    return await Admin.findOne({ id });
};

// admin model static function (isAdminExistByPhone)
adminSchema.statics.isAdminExistByPhone = async function (phone: string) {
    return await Admin.findOne({ phone });
};

// admin model
export const Admin = model<IAdmin, IAdminModel>('Admin', adminSchema);
