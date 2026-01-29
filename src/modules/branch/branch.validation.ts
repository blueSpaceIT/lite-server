import z from 'zod';

// create branch validation
const createBranchValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Name is required' })
            .min(1, { message: 'Name cannot be empty' }),
        code: z
            .string({ required_error: 'Code is required' })
            .min(1, { message: 'Code cannot be empty' }),
        address: z
            .string({ required_error: 'Address is required' })
            .min(1, { message: 'Address cannot be empty' }),
        mapURL: z.string().optional(),
    }),
});

// update branch validation
const updateBranchValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        code: z.string().optional(),
        address: z.string().optional(),
        mapURL: z.string().optional(),
        status: z
            .enum(['Active', 'Inactive'], { message: 'Status is invalid' })
            .optional(),
    }),
});

export const BranchValidations = {
    createBranchValidationSchema,
    updateBranchValidationSchema,
};
