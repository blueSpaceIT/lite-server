import { Types } from 'mongoose';

export interface IMCQAnswer {
    question: Types.ObjectId;
    answer: string;
    mark?: number;
}

export interface ICQAnswer {
    question: Types.ObjectId;
    answer: string[];
    mark?: number;
}

export interface IExamAttempt {
    _id: string;
    course: Types.ObjectId;
    exam: Types.ObjectId;
    student: Types.ObjectId;
    type: 'MCQ' | 'CQ' | 'GAP';
    answers?: IMCQAnswer[] | ICQAnswer[];
    right?: number;
    wrong?: number;
    totalMarks: number;
    obtainedMarks?: number;
    isChecked: boolean;
    isPassed: boolean;
    isLive: boolean;
    startTime: Date;
    endTime: Date;
    submitTime: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICreateExamAttempt {
    exam: Types.ObjectId;
    startTime: Date;
    endTime: Date;
    submitTime: Date;
    type: 'MCQ' | 'CQ' | 'GAP';
    answers: IMCQAnswer[] | ICQAnswer[];
}
