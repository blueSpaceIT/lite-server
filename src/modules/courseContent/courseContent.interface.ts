import { Types } from 'mongoose';

export interface ILiveClass {
    title: string;
    description?: string;
    joinURL: string;
    joinID?: string;
    passcode?: string;
    startTime: Date;
    endTime: Date;
}

export interface ILecture {
    title: string;
    server: 'YouTube' | 'Vimeo' | 'Bunny' | 'Other';
    video: string;
    duration: {
        hours: number;
        minutes: number;
        seconds: number;
    };
    isFree: boolean;
    tags: string[];
}

export interface INote {
    title: string;
    description?: string;
    pdfURL: string;
}

export interface IExam {
    title: string;
    description?: string;
    type: 'MCQ' | 'CQ' | 'Gaps';
    totalQuestions: number;
    totalMarks: number;
    passingMarks: number;
    positiveMarks: number;
    negativeMarks: number;
    duration: {
        hours: number;
        minutes: number;
        seconds: number;
    };
    result: boolean;
    validity: Date;
    questions?: Types.ObjectId[];
}

// course content interface
export interface ICourseContent {
    id: string;
    course: Types.ObjectId;
    module: Types.ObjectId;
    type: 'Live Class' | 'Lecture' | 'Note' | 'Exam';
    content: {
        liveClass?: ILiveClass;
        lecture?: ILecture;
        note?: INote;
        exam?: IExam;
    };
    status: 'Active' | 'Inactive';
    scheduledAt?: Date;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
