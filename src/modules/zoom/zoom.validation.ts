import z from 'zod';

// zoom validation
const zoomValidationSchema = z.object({
    body: z.object({
        meetingNumber: z
            .string({ required_error: 'Meeting number is required' })
            .min(1, { message: 'Meeting number cannot be empty' }),
        expirationSeconds: z.number().optional(),
    }),
});

export const ZoomValidations = {
    zoomValidationSchema,
};
