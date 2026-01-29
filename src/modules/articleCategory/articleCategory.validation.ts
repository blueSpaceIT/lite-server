import z from 'zod';

// create article category validation
const createArticleCategoryValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Name is required' })
            .min(1, { message: 'Name cannot be empty' }),
        description: z
            .string({ required_error: 'Description is required' })
            .min(1, { message: 'Description cannot be empty' }),
        image: z.string().optional(),
    }),
});

// update article category validation
const updateArticleCategoryValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        status: z
            .enum(['Active', 'Inactive'], { message: 'Status is invalid' })
            .optional(),
        image: z.string().optional(),
    }),
});

export const ArticleCategoryValidations = {
    createArticleCategoryValidationSchema,
    updateArticleCategoryValidationSchema,
};
