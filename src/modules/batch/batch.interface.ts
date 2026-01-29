import { Types } from 'mongoose';

export interface IBatch {
    id: string;
    name: string;
    course: Types.ObjectId;
    branch: Types.ObjectId;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
