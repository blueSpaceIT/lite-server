import mongoose from 'mongoose';
import { TErrorMessages, TErrorResponse } from '../interfaces/error';
import httpStatus from 'http-status';

const handleCastError = (err: mongoose.Error.CastError): TErrorResponse => {
    const errorMessages: TErrorMessages = [
        {
            path: err.path,
            message: err.message,
        },
    ];
    const status = httpStatus.BAD_REQUEST;
    return {
        status,
        message: 'Invalid ID',
        errorMessages,
    };
};

export default handleCastError;
