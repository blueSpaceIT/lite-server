import { Types } from 'mongoose';

export interface IModule {
    id: string;
    name: string;
    course: Types.ObjectId;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
