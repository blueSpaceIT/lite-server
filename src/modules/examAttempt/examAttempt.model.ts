import { model, Schema } from 'mongoose';
import { ICQAnswer, IExamAttempt, IMCQAnswer } from './examAttempt.interface';

const answerSchema = new Schema<IMCQAnswer | ICQAnswer>({
    question: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    answer: {
        type: Schema.Types.Mixed,
        required: true,
    },
    mark: {
        type: Number,
    },
});

const examAttemptSchema = new Schema<IExamAttempt>(
    {
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course is required'],
        },
        exam: {
            type: Schema.Types.ObjectId,
            ref: 'CourseContent',
            required: [true, 'Exam is required'],
        },
        student: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: [true, 'Student is required'],
        },
        type: {
            type: String,
            enum: ['MCQ', 'CQ', 'GAP'],
            required: [true, 'Type is required'],
        },
        answers: {
            type: [answerSchema],
        },
        right: {
            type: Number,
        },
        wrong: {
            type: Number,
        },
        totalMarks: {
            type: Number,
            required: true,
        },
        obtainedMarks: {
            type: Number,
        },
        isChecked: {
            type: Boolean,
            default: false,
        },
        isPassed: {
            type: Boolean,
            default: false,
        },
        isLive: {
            type: Boolean,
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        submitTime: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true },
);

export const ExamAttempt = model<IExamAttempt>(
    'ExamAttempt',
    examAttemptSchema,
);
