import { z } from 'zod';

const SSLCommerzValidationSchema = z.object({
    body: z.object({
        totalAmount: z.number({
            required_error: 'Total amount is required',
        }),
        invoiceID: z.string({
            required_error: 'Invoice ID is required',
        }),
        name: z.string({
            required_error: 'Name is required',
        }),
        phone: z.string({
            required_error: 'Phone is required',
        }),
        address: z.string({
            required_error: 'Address is required',
        }),
        type: z.enum(['purchase', 'order'], {
            message: 'Type is invalid',
        }),
        callbackURL: z.string({
            required_error: 'Callback Url is required',
        }),
    }),
});

export const SSLCommerzValidations = {
    SSLCommerzValidationSchema,
};
