import z from 'zod';

const productDescriptionValidationSchema = z.object({
    key: z
        .string({ required_error: 'Key is required' })
        .min(1, 'Key cannot be empty'),
    value: z
        .string({ required_error: 'Value is required' })
        .min(1, 'Value cannot be empty'),
});

const createProductValidationSchema = z.object({
    body: z
        .object({
            name: z
                .string({ required_error: 'Name is required' })
                .min(1, 'Name cannot be empty'),
            shortDescription: z.string().optional(),
            description: z.array(productDescriptionValidationSchema, {
                required_error: 'Description is required',
            }),
            category: z.string({ required_error: 'Category is required' }),
            price: z.number().nonnegative(),
            offerPrice: z.number().nonnegative().optional(),
            stock: z.enum(['In stock', 'Stock out'], {
                message: 'Status is invalid',
            }),
            image: z
                .string({ required_error: 'Image is required' })
                .min(1, 'Image cannot be empty'),
            isBestSelling: z.boolean().default(false),
            isPopular: z.boolean().default(false),
            fullPDF: z.string().optional(),
            shortPDF: z.string().optional(),
        })
        .superRefine((data, ctx) => {
            if (
                data.offerPrice !== undefined &&
                data.offerPrice > 0 &&
                data.offerPrice === data.price
            ) {
                ctx.addIssue({
                    path: ['offerPrice'],
                    code: z.ZodIssueCode.custom,
                    message: 'Offer price cannot be the same as price',
                });
            }
        }),
});

const updateProductValidationSchema = z.object({
    body: z
        .object({
            name: z.string().optional(),
            shortDescription: z.string().optional(),
            description: z.array(productDescriptionValidationSchema).optional(),
            category: z.string().optional(),
            price: z.number().nonnegative().optional(),
            offerPrice: z.number().nonnegative().optional(),
            stock: z
                .enum(['In stock', 'Stock out'], {
                    message: 'Status is invalid',
                })
                .optional(),
            status: z
                .enum(['Active', 'Inactive'], { message: 'Status is invalid' })
                .optional(),
            isBestSelling: z.boolean().optional(),
            isPopular: z.boolean().optional(),
            image: z.string().optional(),
            fullPDF: z.string().optional(),
            shortPDF: z.string().optional(),
        })
        .superRefine((data, ctx) => {
            if (
                data.price !== undefined &&
                data.offerPrice !== undefined &&
                data.offerPrice > 0 &&
                data.offerPrice === data.price
            ) {
                ctx.addIssue({
                    path: ['offerPrice'],
                    code: z.ZodIssueCode.custom,
                    message: 'Offer price cannot be the same as price',
                });
            }
        }),
});

export const ProductValidations = {
    createProductValidationSchema,
    updateProductValidationSchema,
};
