import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import useragent from 'express-useragent';
import httpStatus from 'http-status';
import qs from 'qs';
import config from '../config';
import globalErrorHandler from '../middlewares/globalErrorHandler';
import notFound from '../middlewares/notFound';
import router from '../routes';
import { chunkUpload } from '../utils/chunkUpload';
import { finalizeUpload } from '../utils/finalizeUpload';
import secretGenerate from '../utils/secretGenerate';
import sendSMS from '../utils/sendSMS';

// initialize express application
const app: Application = express();

// query parser
app.set('query parser', (str: string) => qs.parse(str));

// cross origin resources
app.use(
    cors({
        origin: [
            'https://www.oditicareer.com',
            config.frontendUrl as string,
            config.panelUrl as string,
            'http://localhost:5173',
            'http://localhost:3000',
            'http://localhost:5174',
        ],
        credentials: true,
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'uploadid',
            'chunkindex',
            'X-Requested-With',
        ],
    }),
);

// cookie parser
app.use(cookieParser());

// json parser
app.use(express.json());

// urlencoded parser
app.use(express.urlencoded({ extended: true }));

// device parser
app.use(useragent.express());

// initial route
app.get('/', (req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        status: 200,
        success: true,
        message: 'Server is running successfully',
        data: new Date(new Date().getTime() + 6 * 60 * 60 * 1000),
    });
});

// sms route
app.get('/sms', async (req: Request, res: Response) => {
    try {
        const result = await sendSMS('01616720009', '{ODITI} Test SMS');

        // Check if SMS was sent successfully
        if (result?.status === 202) {
            // Check based on your SMS provider's success status
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                success: true,
                message: 'SMS sent successfully',
                data: {
                    timestamp: new Date(
                        new Date().getTime() + 6 * 60 * 60 * 1000,
                    ),
                    result: result,
                },
            });
        } else {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                success: false,
                message: 'SMS failed to send',
                data: {
                    timestamp: new Date(
                        new Date().getTime() + 6 * 60 * 60 * 1000,
                    ),
                    error: result,
                },
            });
        }
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: 'Internal server error while sending SMS',
            data: {
                timestamp: new Date(new Date().getTime() + 6 * 60 * 60 * 1000),
                error: process.env.NODE_ENV === 'development' ? err : undefined,
            },
        });
    }
});

// secret generate route
app.get('/secret/:length', (req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        status: 200,
        success: true,
        message: 'Secret has been generated successfully',
        data: secretGenerate(Number(req.params?.length || 20)),
    });
});

// chunk upload route
app.post('/chunk-upload', chunkUpload);

// finalize upload route
app.post('/finalize-upload', finalizeUpload);

// application routes
app.use('/api/v1', router);

// global error handler
app.use(globalErrorHandler);

// not found api
app.use(notFound);

export default app;
