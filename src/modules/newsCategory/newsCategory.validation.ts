import z from 'zod';

// create news category validation
const createNewsCategoryValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Name is required' })
            .min(1, { message: 'Name cannot be empty' }),
    }),
});

// update news category validation
const updateNewsCategoryValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        status: z
            .enum(['Active', 'Inactive'], { message: 'Status is invalid' })
            .optional(),
    }),
});

export const NewsCategoryValidations = {
    createNewsCategoryValidationSchema,
    updateNewsCategoryValidationSchema,
};
