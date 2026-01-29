import { Model } from 'mongoose';

// guardian interface
export interface IGuardian {
    name?: string;
    phone?: string;
}

// student interface
export interface IStudent {
    id: string;
    name: string;
    phone: string;
    password: string;
    otp: string;
    nid?: string;
    address?: string;
    guardian?: IGuardian;
    school?: string;
    college?: string;
    university?: string;
    department?: string;
    district?: string;
    role: 'student';
    status: 'Active' | 'Inactive';
    image?: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// student model interface
export interface IStudentModel extends Model<IStudent> {
    isStudentExistById(id: string): IStudent;
    isStudentExistByPhone(phone: string): IStudent;
}
