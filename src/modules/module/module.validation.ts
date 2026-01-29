import z from 'zod';

// create module validation
const createModuleValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Name is required' })
            .min(1, { message: 'Name cannot be empty' }),
        course: z.string({ required_error: 'Course is required' }),
    }),
});

// update module validation
const updateModuleValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
    }),
});

export const ModuleValidations = {
    createModuleValidationSchema,
    updateModuleValidationSchema,
};
