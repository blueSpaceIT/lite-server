import { model, Schema } from 'mongoose';
import { TQuestion } from './question.interface';

const questionSchema = new Schema<TQuestion>(
    {
        id: {
            type: String,
            required: [true, 'Question ID is required'],
            unique: true,
        },
        type: {
            type: String,
            enum: ['MCQ', 'CQ', 'GAPS'],
            required: [true, 'Question type is required'],
        },
        question: {
            type: String,
            required: [true, 'Question is required'],
        },
        options: {
            type: [String],
            required: function () {
                return this.type === 'MCQ';
            },
        },
        answer: {
            type: Schema.Types.Mixed,
            required: [true, 'Answer is required'],
            validate: {
                validator: function (value: unknown) {
                    if (this.type === 'MCQ' || this.type === 'CQ') {
                        return typeof value === 'string';
                    }
                    if (this.type === 'GAPS') {
                        return (
                            Array.isArray(value) &&
                            value.every(v => typeof v === 'string')
                        );
                    }
                    return false;
                },
                message: 'Invalid answer type for question',
            },
        },
        explaination: {
            type: String,
        },
        tags: {
            type: [Schema.Types.ObjectId],
            ref: 'Tag',
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: [true, 'Creator is required'],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export const Question = model<TQuestion>('Question', questionSchema);
