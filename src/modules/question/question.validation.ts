import z from 'zod';

// Base fields
const baseQuestionSchema = {
    question: z
        .string({ required_error: 'Question is required' })
        .min(1, 'Question cannot be empty'),
    explaination: z.string().optional(),
    tags: z.array(z.string()).optional(),
};

// Variants
const mcqSchema = z.object({
    type: z.literal('MCQ'),
    options: z
        .array(z.string().min(1, 'Option cannot be empty'))
        .length(4, 'There must be 4 options'),
    answer: z
        .string({ required_error: 'Answer is required' })
        .min(1, 'Answer cannot be empty'),
});

const cqSchema = z.object({
    type: z.literal('CQ'),
    answer: z
        .string({ required_error: 'Answer is required' })
        .min(1, 'Answer cannot be empty'),
});

const gapsSchema = z.object({
    type: z.literal('GAPS'),
    answer: z
        .array(z.string())
        .min(1, 'At least one correct answer is required'),
});

const createQuestionValidationSchema = z.object({
    body: z.discriminatedUnion('type', [
        mcqSchema.extend(baseQuestionSchema),
        cqSchema.extend(baseQuestionSchema),
        gapsSchema.extend(baseQuestionSchema),
    ]),
});

const updateMcqSchema = mcqSchema.partial().extend({
    type: z.literal('MCQ'),
});
const updateCqSchema = cqSchema.partial().extend({
    type: z.literal('CQ'),
});
const updateGapsSchema = gapsSchema.partial().extend({
    type: z.literal('GAPS'),
});

const updateQuestionValidationSchema = z.object({
    body: z.discriminatedUnion('type', [
        updateMcqSchema.extend(baseQuestionSchema),
        updateCqSchema.extend(baseQuestionSchema),
        updateGapsSchema.extend(baseQuestionSchema),
    ]),
});

export const QuestionValidations = {
    createQuestionValidationSchema,
    updateQuestionValidationSchema,
};
