import z from 'zod';

// order product validation
const orderProductValidationSchema = z.object({
    product: z.string({ required_error: 'Product is required' }),
    price: z.number({ required_error: 'Price is required' }),
    quantity: z.number({ required_error: 'Quantity is required' }),
});

// payment details validation
const paymentDetailsValidationSchema = z.object({
    method: z.enum(['Cash', 'SSLCommerz', 'Bkash', 'Nagad', 'Rocket'], {
        message: 'Method is invalid',
    }),
    amount: z.number({ required_error: 'Price is required' }),
    account: z.string().optional(),
    trxID: z.number().optional(),
});

// create order validation
const createOrderValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Name is required' })
            .min(1, { message: 'Name cannot be empty' }),
        phone: z
            .string({ required_error: 'Phone is required' })
            .min(11, { message: 'Phone should be 11 digit' })
            .max(11, { message: 'Phone should be 11 digit' }),
        orderType: z.enum(['hardcopy', 'ebook'], {
            message: 'Order type is invalid',
        }),
        address: z.string().optional(),
        area: z
            .enum(['Dhaka', 'Dhaka Out', 'Office Pickup'], {
                message: 'Area is invalid',
            })
            .optional(),
        payMethod: z.enum(['Cash On Delivery', 'Payment Gateway'], {
            message: 'Pay method is invalid',
        }),
        discount: z.number().optional(),
        coupon: z.string().optional(),
        discountReason: z.string().optional(),
        products: z.array(orderProductValidationSchema),
    }),
});

// update order validation
const updateOrderValidationSchema = z.object({
    body: z.object({
        phone: z.string().optional(),
        address: z.string().optional(),
        area: z
            .enum(['Dhaka', 'Dhaka Out', 'Office Pickup'], {
                message: 'Area is invalid',
            })
            .optional(),
        status: z
            .enum(
                [
                    'Pending',
                    'On Hold',
                    'Accepted',
                    'Cancelled',
                    'Out for delivery',
                    'Delivered',
                ],
                { message: 'Status is invalid' },
            )
            .optional(),
        payStatus: z
            .enum(['Paid', 'Pending', 'Refunded'], {
                message: 'Pay status is invalid',
            })
            .optional(),
        paymentDetails: z.array(paymentDetailsValidationSchema).optional(),
    }),
});

export const OrderValidations = {
    createOrderValidationSchema,
    updateOrderValidationSchema,
};
