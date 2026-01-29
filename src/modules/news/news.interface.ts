import { Types } from 'mongoose';

// news interface
export interface INews {
    id: string;
    name: string;
    description: string;
    category: Types.ObjectId;
    tags?: string[];
    status: 'Active' | 'Inactive';
    image: string;
    author: Types.ObjectId;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
