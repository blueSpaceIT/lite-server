import z from 'zod';

// create course category validation
const createCourseCategoryValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Name is required' })
            .min(1, { message: 'Name cannot be empty' }),
        image: z.string().optional(),
    }),
});

// update course category validation
const updateCourseCategoryValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        status: z
            .enum(['Active', 'Inactive'], { message: 'Status is invalid' })
            .optional(),
        image: z.string().optional(),
    }),
});

export const CourseCategoryValidations = {
    createCourseCategoryValidationSchema,
    updateCourseCategoryValidationSchema,
};
