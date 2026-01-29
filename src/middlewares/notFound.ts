import { NextFunction, Request, Response } from 'express';
import sendResponse from '../utils/sendResponse';
import httpStatus from 'http-status';

const notFound = (req: Request, res: Response, next: NextFunction) => {
    return sendResponse(res, {
        status: httpStatus.NOT_FOUND,
        success: false,
        message: 'API Not Found',
        data: null,
    });
};

export default notFound;
