import { z } from 'zod';

const sliderValidationSchema = z.object({
    body: z.object({
        images: z.array(z.string(), {
            required_error: 'Images is required',
        }),
    }),
});

const sliderGalleryValidationSchema = z.object({
    body: z.object({
        url: z.string({
            required_error: 'Url is required',
        }),
        destination: z.string({
            required_error: 'Destination Url is required',
        }),
    }),
});

export const SliderValidations = {
    sliderValidationSchema,
    sliderGalleryValidationSchema,
};
