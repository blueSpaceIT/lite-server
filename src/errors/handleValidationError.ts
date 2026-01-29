import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { TErrorMessages, TErrorResponse } from '../interfaces/error';

const handleValidationError = (
    err: mongoose.Error.ValidationError,
): TErrorResponse => {
    const errorMessages: TErrorMessages = Object.values(err.errors).map(
        (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
            return {
                path: val?.path,
                message: val?.message,
            };
        },
    );
    const status = httpStatus.BAD_REQUEST;
    return {
        status,
        message: 'Validation error',
        errorMessages,
    };
};

export default handleValidationError;
