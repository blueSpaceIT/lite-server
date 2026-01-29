import { z } from 'zod';

const marqueeValidationSchema = z.object({
    body: z.object({
        messages: z.array(z.string(), {
            required_error: 'Messages is required',
        }),
    }),
});

export const MarqueeValidations = {
    marqueeValidationSchema,
};
