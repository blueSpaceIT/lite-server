import { Model, Types } from 'mongoose';
import { ADMIN_ROLES } from './admin.constant';

// admin role type
export type TAdminRole = keyof typeof ADMIN_ROLES;

// admin interface
export interface IAdmin {
    id: string;
    name: string;
    phone: string;
    password: string;
    otp: string;
    branch?: Types.ObjectId;
    designation: string;
    quote?: string;
    nid?: string;
    address?: string;
    role: TAdminRole;
    status: 'Active' | 'Inactive';
    image?: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// admin model interface
export interface IAdminModel extends Model<IAdmin> {
    isAdminExistById(id: string): IAdmin;
    isAdminExistByPhone(phone: string): IAdmin;
}
