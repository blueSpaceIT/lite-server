import z from 'zod';

// signin validation
const signinValidationSchema = z.object({
    body: z.object({
        phone: z
            .string({ required_error: 'Phone is required' })
            .min(11, { message: 'Phone must be 11 digit' })
            .max(11, { message: 'Phone must be 11 digit' }),
        password: z
            .string({ required_error: 'Password is required' })
            .min(8, { message: 'Password must be at least 8 character' }),
    }),
});

// refresh token validation
const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({ required_error: 'Token is required' }),
    }),
});

// forget password validation
const forgetPasswordValidationSchema = z.object({
    body: z.object({
        phone: z
            .string({ required_error: 'Phone is required' })
            .min(11, { message: 'Phone must be 11 digit' })
            .max(11, { message: 'Phone must be 11 digit' }),
    }),
});

// reset password validation
const resetPasswordValidationSchema = z.object({
    body: z.object({
        password: z
            .string({ required_error: 'Password is required' })
            .min(8, { message: 'Password must be at least 8 character' }),
    }),
});

export const AuthValidations = {
    signinValidationSchema,
    refreshTokenValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema,
};
