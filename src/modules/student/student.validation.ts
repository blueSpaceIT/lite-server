import z from 'zod';

// guardian validation schema
const guardianValidationSchema = z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
});

// create student validation
const createStudentValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Name is required' })
            .min(1, { message: 'Name cannot be empty' }),
        phone: z
            .string({ required_error: 'Phone is required' })
            .min(11, { message: 'Phone must be 11 digit' })
            .max(11, { message: 'Phone must be 11 digit' }),
        password: z.string().optional(),
    }),
});

// update student validation
const updateStudentValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        nid: z.string().optional(),
        address: z.string().optional(),
        guardian: guardianValidationSchema.optional(),
        school: z.string().optional(),
        college: z.string().optional(),
        university: z.string().optional(),
        department: z.string().optional(),
        district: z.string().optional(),
        status: z
            .enum(['Active', 'Inactive'], { message: 'Status is invalid' })
            .optional(),
        image: z.string().optional(),
    }),
});

// update student password validation
const updateStudentPasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z
            .string({ required_error: 'Old password is required' })
            .min(8, { message: 'Old password must be at least 8 character' }),
        newPassword: z
            .string({ required_error: 'New password is required' })
            .min(8, { message: 'New password must be at least 8 character' }),
    }),
});

export const StudentValidations = {
    createStudentValidationSchema,
    updateStudentValidationSchema,
    updateStudentPasswordValidationSchema,
};
