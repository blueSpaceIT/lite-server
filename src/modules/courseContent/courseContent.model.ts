import { Schema, model } from 'mongoose';
import {
    ICourseContent,
    IExam,
    ILecture,
    ILiveClass,
    INote,
} from './courseContent.interface';


export const liveClassSchema = new Schema<ILiveClass>({
    title: { type: String, required: true },
    description: { type: String },
    joinURL: { type: String, required: true },
    joinID: { type: String },
    passcode: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
});

export const lectureSchema = new Schema<ILecture>({
    title: { type: String, required: true },
    server: {
        type: String,
        enum: ['YouTube', 'Vimeo', 'Bunny', 'Other'],
        required: true,
    },
    video: { type: String, required: true },
    duration: {
        hours: { type: Number, required: true },
        minutes: { type: Number, required: true },
        seconds: { type: Number, required: true },
    },
    isFree: { type: Boolean, required: true },
    tags: { type: [String], required: true },
});

export const noteSchema = new Schema<INote>({
    title: { type: String, required: true },
    description: { type: String },
    pdfURL: { type: String, required: true },
});

export const examSchema = new Schema<IExam>({
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['MCQ', 'CQ', 'Gaps'], required: true },
    totalQuestions: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    passingMarks: { type: Number, required: true },
    positiveMarks: { type: Number, required: true },
    negativeMarks: { type: Number, required: true },
    duration: {
        hours: { type: Number, required: true },
        minutes: { type: Number, required: true },
        seconds: { type: Number, required: true },
    },
    result: { type: Boolean, default: false },
    validity: { type: Date, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
});

const courseContentSchema = new Schema<ICourseContent>(
    {
        id: {
            type: String,
            required: [true, 'Course ID is required'],
            unique: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        module: {
            type: Schema.Types.ObjectId,
            ref: 'Module',
            required: true,
        },
        type: {
            type: String,
            enum: ['Live Class', 'Lecture', 'Note', 'Exam'],
            required: true,
        },
        content: {
            liveClass: { type: liveClassSchema },
            lecture: { type: lectureSchema },
            note: { type: noteSchema },
            exam: { type: examSchema },
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
        scheduledAt: { type: Date },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export const CourseContent = model<ICourseContent>(
    'CourseContent',
    courseContentSchema,
);
