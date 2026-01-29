import { Types } from 'mongoose';

export interface IMedia {
    id: string;
    admin?: Types.ObjectId;
    student?: Types.ObjectId;
    url: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IVideo {
  url: string;
  type: 'video';
  size?: number;
}
