import z from 'zod';

const answerValidationSchema = z.object({
    question: z.string({ required_error: 'Question is required' }),
    answer: z.string({ required_error: 'Answer is required' }),
});

const answerCQValidationSchema = z.object({
    question: z.string({ required_error: 'Question is required' }),
    answer: z.array(z.string()).optional(),
});

const createMCQAndGAPExamAttemptValidationSchema = z.object({
    body: z.object({
        exam: z.string({ required_error: 'Exam is required' }),
        startTime: z
            .string({ required_error: 'Start time is required' })
            .datetime(),
        endTime: z
            .string({ required_error: 'End time is required' })
            .datetime(),
        submitTime: z
            .string({
                required_error: 'Submit time is required',
            })
            .datetime(),
        type: z.enum(['MCQ', 'GAP'], { required_error: 'Type is required' }),
        answers: z.array(answerValidationSchema, {
            required_error: 'Answers are required',
        }),
    }),
});

const createCQExamAttemptValidationSchema = z.object({
    body: z.object({
        exam: z.string({ required_error: 'Exam is required' }),
        startTime: z
            .string({ required_error: 'Start time is required' })
            .datetime(),
        endTime: z
            .string({ required_error: 'End time is required' })
            .datetime(),
        submitTime: z
            .string({
                required_error: 'Submit time is required',
            })
            .datetime(),
        type: z.enum(['CQ'], { required_error: 'Type is required' }),
        answers: z.array(answerCQValidationSchema, {
            required_error: 'Answers are required',
        }),
    }),
});

export const ExamAttemptValidations = {
    createMCQAndGAPExamAttemptValidationSchema,
    createCQExamAttemptValidationSchema,
};
