import z from 'zod';

const createBatchValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Name is required' })
            .min(1, 'Name cannot be empty'),
        course: z.string({ required_error: 'Course is required' }),
        branch: z.string({ required_error: 'Branch is required' }),
    }),
});

const updateBatchValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        course: z.string().optional(),
        branch: z.string().optional(),
    }),
});

export const BatchValidations = {
    createBatchValidationSchema,
    updateBatchValidationSchema,
};
