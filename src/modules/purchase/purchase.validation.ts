import z from 'zod';

// payment details validation
const paymentDetailsValidationSchema = z.object({
    method: z.enum(['Cash', 'SSLCommerz', 'Bkash', 'Nagad', 'Rocket'], {
        message: 'Method is invalid',
    }),
    amount: z.number({ required_error: 'Price is required' }),
    account: z.string().optional(),
    trxID: z.string().optional(),
});

// create purchase validation
const createPurchaseValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Name is required' })
            .min(1, { message: 'Name cannot be empty' }),
        phone: z
            .string({ required_error: 'Phone is required' })
            .min(11, { message: 'Phone should be 11 digit' })
            .max(11, { message: 'Phone should be 11 digit' }),
        course: z.string({ required_error: 'Course is required' }),
        batch: z.string().optional(),
        price: z.number({ required_error: 'Price is required' }),
        coupon: z.string().optional(),
        discountReason: z.string().optional(),
        discount: z.number().optional(),
        branch: z.string().default('online'),
        dueDate: z.string().datetime().optional(),
        status: z
            .enum(['Active', 'Pending', 'Course Out'], {
                message: 'Status is invalid',
            })
            .optional(),
        paymentDetails: z.array(paymentDetailsValidationSchema).optional(),
    }),
});

// update purchase validation
const updatePurchaseValidationSchema = z.object({
    body: z.object({
        paymentDetails: paymentDetailsValidationSchema.optional(),
        dueDate: z.string().datetime().optional(),
    }),
});

export const PurchaseValidations = {
    createPurchaseValidationSchema,
    updatePurchaseValidationSchema,
};
