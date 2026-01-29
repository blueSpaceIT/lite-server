import { Types } from 'mongoose';

export interface IProductDescription {
    key: string;
    value: string;
}

export interface IProduct {
    id: string;
    name: string;
    shortDescription?: string;
    description: IProductDescription[];
    category: Types.ObjectId;
    price: number;
    offerPrice?: number;
    stock: 'In stock' | 'Stock out';
    status: 'Active' | 'Inactive';
    isBestSelling: boolean;
    isPopular: boolean;
    image: string;
    fullPDF?: string;
    shortPDF?: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
