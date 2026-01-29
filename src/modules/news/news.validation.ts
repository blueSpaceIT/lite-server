import z from 'zod';

// create news validation
const createNewsValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Name is required' })
            .min(1, { message: 'Name cannot be empty' }),
        description: z
            .string({ required_error: 'Name is required' })
            .min(1, { message: 'Name cannot be empty' }),
        category: z.string({ required_error: 'Category is required' }),
        tags: z.array(z.string()).optional(),
        status: z
            .enum(['Active', 'Inactive'], { message: 'Status is invalid' })
            .optional(),
        image: z
            .string({ required_error: 'Image is required' })
            .min(1, { message: 'Image cannot be empty' }),
        author: z
            .string({ required_error: 'Author is required' })
            .min(1, { message: 'Author cannot be empty' }),
    }),
});

// update news validation
const updateNewsValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
        status: z
            .enum(['Active', 'Inactive'], { message: 'Status is invalid' })
            .optional(),
        image: z.string().optional(),
    }),
});

export const NewsValidations = {
    createNewsValidationSchema,
    updateNewsValidationSchema,
};
