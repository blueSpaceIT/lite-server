import { z } from 'zod';

const createPaymentSchema = z.object({
    body: z.object({
        totalAmount: z.number(),
        invoiceID: z.string(),
        name: z.string(),
        phone: z.string(),
        email: z.string().email(),
        address: z.string(),
        type: z.enum(['purchase', 'order']),
        callbackURL: z.string().url(),
    }),
});

export const PayStationValidations = {
    createPaymentSchema,
};
