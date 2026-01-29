import z from 'zod';
import { ADMIN_ROLES_ARRAY } from './admin.constant';

// create admin validation
const createAdminValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Name is required' })
            .min(1, { message: 'Name cannot be empty' }),
        phone: z
            .string({ required_error: 'Phone is required' })
            .min(11, { message: 'Phone must be 11 digit' })
            .max(11, { message: 'Phone must be 11 digit' }),
        password: z.string().optional(),
        branch: z.string().optional(),
        designation: z
            .string({ required_error: 'Designation is required' })
            .min(1, { message: 'Designation cannot be empty' }),
        nid: z.string().optional(),
        address: z.string().optional(),
        role: z.enum([...ADMIN_ROLES_ARRAY], { message: 'Role is invalid' }),
        image: z.string().optional(),
    }),
});

// update admin validation
const updateAdminValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        branch: z.string().optional(),
        designation: z.string().optional(),
        quote: z.string().optional(),
        nid: z.string().optional(),
        address: z.string().optional(),
        role: z
            .enum([...ADMIN_ROLES_ARRAY], { message: 'Role is invalid' })
            .optional(),
        status: z
            .enum(['Active', 'Inactive'], { message: 'Status is invalid' })
            .optional(),
        image: z.string().optional(),
    }),
});

// update admin password validation
const updateAdminPasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z
            .string({ required_error: 'Old password is required' })
            .min(8, { message: 'Old password must be at least 8 character' }),
        newPassword: z
            .string({ required_error: 'New password is required' })
            .min(8, { message: 'New password must be at least 8 character' }),
    }),
});

export const AdminValidations = {
    createAdminValidationSchema,
    updateAdminValidationSchema,
    updateAdminPasswordValidationSchema,
};
