import z from 'zod';

const createAccountValidationSchema = z.object({
    body: z.object({
        type: z.enum(['Earning', 'Expense'], {
            required_error: 'Type is required',
        }),
        reason: z.array(z.string(), { required_error: 'Reason is required' }),
        method: z.enum(
            ['Cash', 'SSLCommerz', 'Bank', 'Bkash', 'Nagad', 'Rocket'],
            { required_error: 'Method is required' },
        ),
        amount: z.number({ required_error: 'Amount is required' }),
        branch: z.string(),
    }),
});

const updateAccountValidationSchema = z.object({
    body: z.object({
        type: z.enum(['Earning', 'Expense']).optional(),
        reason: z.array(z.string()).optional(),
        method: z
            .enum(['Cash', 'SSLCommerz', 'Bank', 'Bkash', 'Nagad', 'Rocket'])
            .optional(),
        amount: z.number().optional(),
        branch: z.string().optional(),
    }),
});

export const AccountValidations = {
    createAccountValidationSchema,
    updateAccountValidationSchema,
};
