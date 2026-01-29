import z from 'zod';

const discountValidationSchema = z.object({
    type: z.enum(['Fixed', 'Percentage'], { message: 'Type is invalid' }),
    amount: z.number({ required_error: 'Amount is required' }),
});

// create coupon validation
const createCouponValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Name is required' })
            .min(1, { message: 'Name cannot be empty' }),
        discount: discountValidationSchema,
        issuedAt: z
            .string({ required_error: 'Issued time is required' })
            .datetime(),
        expiredAt: z
            .string({ required_error: 'Expired time is required' })
            .datetime(),
    }),
});

// update coupon validation
const updateCouponValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        discount: discountValidationSchema.optional(),
        issuedAt: z.string().datetime().optional(),
        expiredAt: z.string().datetime().optional(),
    }),
});

export const CouponValidations = {
    createCouponValidationSchema,
    updateCouponValidationSchema,
};
