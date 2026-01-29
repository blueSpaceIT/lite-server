import { Types } from 'mongoose';

export interface IBaseQuestion {
    id: string;
    question: string;
    explaination?: string;
    tags?: Types.ObjectId[];
    createdBy: Types.ObjectId;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IQuestionMCQ extends IBaseQuestion {
    type: 'MCQ';
    options: string[];
    answer: string;
}

export interface IQuestionCQ extends IBaseQuestion {
    type: 'CQ';
    answer: string;
}

export interface IQuestionGaps extends IBaseQuestion {
    type: 'GAPS';
    answer: string[];
}

export type TQuestion = IQuestionMCQ | IQuestionCQ | IQuestionGaps;
