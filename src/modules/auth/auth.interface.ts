import { Types } from 'mongoose';

export interface IStudentAuth {
    student: Types.ObjectId;
    phone: string;
    ipAddress: string;
    deviceType: string;
    deviceName: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IAuth {
    phone: string;
    password: string;
}
