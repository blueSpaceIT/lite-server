import z from 'zod';

const createTagValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Name is required' })
            .min(1, { message: 'Name cannot be empty' }),
    }),
});

const updateTagValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
    }),
});

export const TagValidations = {
    createTagValidationSchema,
    updateTagValidationSchema,
};
