import { z } from 'zod';

const createLiveClassValidationSchema = z.object({
    title: z.string({ required_error: 'Title is required' }),
    description: z.string().optional(),
    joinURL: z.string({ required_error: 'Join URL is required' }),
    joinID: z.string().optional(),
    passcode: z.string().optional(),
    startTime: z
        .string({ required_error: 'Start time is required' })
        .datetime(),
    endTime: z.string({ required_error: 'End time is required' }).datetime(),
});

const updateLiveClassValidationSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    joinURL: z.string().optional(),
    joinID: z.string().optional(),
    passcode: z.string().optional(),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
});

const createLectureValidationSchema = z.object({
    title: z.string({ required_error: 'Title is required' }),
    server: z.enum(['YouTube', 'Vimeo', 'Bunny', 'Other'], {
        required_error: 'Server is required',
    }),
    video: z.string({
        required_error: 'Video media ID is required',
    }),
    duration: z.object({
        hours: z.number({ required_error: 'Hours are required' }),
        minutes: z.number({ required_error: 'Minutes are required' }),
        seconds: z.number({ required_error: 'Seconds are required' }),
    }),
    isFree: z.boolean({ required_error: 'isFree is required' }),
    tags: z.array(z.string(), { required_error: 'Tags are required' }),
});

const updateLectureValidationSchema = z.object({
    title: z.string().optional(),
    server: z.enum(['YouTube', 'Vimeo', 'Bunny', 'Other']).optional(),
    video: z.string().optional(),
    duration: z
        .object({
            hours: z.number().optional(),
            minutes: z.number().optional(),
            seconds: z.number().optional(),
        })
        .optional(),
    isFree: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
});

const createNoteValidationSchema = z.object({
    title: z.string({ required_error: 'Title is required' }),
    description: z.string().optional(),
    pdfURL: z.string({ required_error: 'PDF URL is required' }),
});

const updateNoteValidationSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    pdfURL: z.string().optional(),
});

const createExamValidationSchema = z.object({
    title: z.string({ required_error: 'Title is required' }),
    description: z.string().optional(),
    type: z.enum(['MCQ', 'CQ', 'Gaps'], {
        required_error: 'Type is required',
    }),
    totalQuestions: z.number({ required_error: 'Total questions is required' }),
    totalMarks: z.number({ required_error: 'Total marks is required' }),
    passingMarks: z.number({ required_error: 'Passing marks is required' }),
    positiveMarks: z.number({ required_error: 'Positive marks is required' }),
    negativeMarks: z.number({ required_error: 'Negative marks is required' }),
    duration: z.object({
        hours: z.number({ required_error: 'Hours are required' }),
        minutes: z.number({ required_error: 'Minutes are required' }),
        seconds: z.number({ required_error: 'Seconds are required' }),
    }),
    validity: z.string({ required_error: 'Validity is required' }).datetime(),
    questions: z.array(z.string()).optional(),
});

const updateExamValidationSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    type: z.enum(['MCQ', 'CQ', 'Gaps']).optional(),
    totalQuestions: z.number().optional(),
    totalMarks: z.number().optional(),
    passingMarks: z.number().optional(),
    positiveMarks: z.number().optional(),
    negativeMarks: z.number().optional(),
    duration: z
        .object({
            hours: z.number().optional(),
            minutes: z.number().optional(),
            seconds: z.number().optional(),
        })
        .optional(),
    result: z.boolean().optional(),
    validity: z.string().datetime().optional(),
    questions: z.array(z.string()).optional(),
});

const createCourseContentValidationSchema = z.object({
    body: z.object({
        course: z.string({ required_error: 'Course ID is required' }),
        module: z.string({ required_error: 'Module ID is required' }),
        type: z.enum(['Live Class', 'Lecture', 'Note', 'Exam'], {
            required_error: 'Type is required',
        }),
        content: z.object({
            liveClass: createLiveClassValidationSchema.optional(),
            lecture: createLectureValidationSchema.optional(),
            note: createNoteValidationSchema.optional(),
            exam: createExamValidationSchema.optional(),
        }),
        scheduledAt: z
            .string({ required_error: 'Scheduled time is required' })
            .datetime()
            .optional(),
    }),
});

const updateCourseContentValidationSchema = z.object({
    body: z.object({
        content: z
            .object({
                liveClass: updateLiveClassValidationSchema.optional(),
                lecture: updateLectureValidationSchema.optional(),
                note: updateNoteValidationSchema.optional(),
                exam: updateExamValidationSchema.optional(),
            })
            .optional(),
        scheduledAt: z.string().datetime().optional(),
        status: z.enum(['Active', 'Inactive']).optional(),
    }),
});

export const CourseContentValidations = {
    createCourseContentValidationSchema,
    updateCourseContentValidationSchema,
};
