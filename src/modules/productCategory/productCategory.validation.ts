import z from 'zod';

// create product category validation
const createProductCategoryValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Name is required' })
            .min(1, { message: 'Name cannot be empty' }),
    }),
});

// update product category validation
const updateProductCategoryValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        status: z
            .enum(['Active', 'Inactive'], { message: 'Status is invalid' })
            .optional(),
    }),
});

export const ProductCategoryValidations = {
    createProductCategoryValidationSchema,
    updateProductCategoryValidationSchema,
};
