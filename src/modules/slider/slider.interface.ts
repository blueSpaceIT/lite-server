import { Types } from 'mongoose';

export interface ISlider {
    id: string;
    images: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISliderGallery {
    id: string;
    url: string;
    destination: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
