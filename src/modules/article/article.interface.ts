import { Types } from 'mongoose';

// article interface
export interface IArticle {
    id: string;
    name: string;
    description: string;
    category: Types.ObjectId;
    tags?: string[];
    featured: boolean;
    status: 'Active' | 'Inactive';
    image: string;
    author: Types.ObjectId;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
