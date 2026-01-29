import { Types } from 'mongoose';

export interface ICourseReview {
    id: string;
    course: Types.ObjectId;
    student: Types.ObjectId;
    status: 'Approved' | 'Pending' | 'Rejected';
    rating: number;
    comment: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
