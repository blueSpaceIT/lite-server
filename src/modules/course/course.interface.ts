import { Types } from 'mongoose';

export interface ICourseDetails {
    totalClasses?: number;
    totalLiveClasses?: number;
    totalLectures?: number;
    totalNotes?: number;
    totalExams?: number;
}

export interface ICourse {
    id: string;
    name: string;
    code: string;
    typeCode: string;
    shortDescription?: string;
    description: string;
    type: 'Online' | 'Offline';
    category: Types.ObjectId;
    teachers?: Types.ObjectId[];
    price: number;
    offerPrice?: number;
    details?: ICourseDetails;
    status: 'Active' | 'Inactive';
    trailer?: string;
    duration: [string, string];
    expiredTime: [number, string];
    reviewed: boolean;
    routine?: string;
    routinePDF?: string;
    image: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
