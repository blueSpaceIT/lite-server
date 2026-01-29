import httpStatus from 'http-status';
import { ZodError, ZodIssue } from 'zod';
import { TErrorMessages, TErrorResponse } from '../interfaces/error';

const handleZodError = (err: ZodError): TErrorResponse => {
    const errorMessages: TErrorMessages = err.issues.map((issue: ZodIssue) => {
        return {
            path: issue?.path[issue.path.length - 1],
            message: issue.message,
        };
    });
    const status = httpStatus.BAD_REQUEST;
    return {
        status,
        message: err.issues[0].message,
        errorMessages,
    };
};

export default handleZodError;
