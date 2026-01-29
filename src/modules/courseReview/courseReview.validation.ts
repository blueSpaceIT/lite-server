import z from 'zod';

const createCourseReviewValidationSchema = z.object({
    body: z.object({
        course: z.string({ required_error: 'Course is required' }),
        student: z.string({ required_error: 'Student is required' }),
        rating: z.number({ required_error: 'Rating is required' }),
        comment: z
            .string({ required_error: 'Comment is required' })
            .min(1, 'Comment cannot be empty'),
    }),
});

const updateCourseReviewValidationSchema = z.object({
    body: z.object({
        rating: z.number().optional(),
        comment: z.string().optional(),
        status: z
            .enum(['Approved', 'Pending', 'Rejected'], {
                message: 'Status is invalid',
            })
            .optional(),
    }),
});

export const CourseReviewValidations = {
    createCourseReviewValidationSchema,
    updateCourseReviewValidationSchema,
};
