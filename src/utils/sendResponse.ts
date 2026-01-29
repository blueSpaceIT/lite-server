import { Response } from 'express';

interface IResponse<T> {
    status: number;
    success: boolean;
    message: string;
    data: T;
}

const sendResponse = <T>(res: Response, data: IResponse<T>) => {
    const response: Partial<IResponse<T>> = {
        status: data.status,
        success: data.success,
        message: data.message,
        data: data.data,
    };

    res.status(data.status).json(response);
};

export default sendResponse;
