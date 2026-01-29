import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import fs from 'fs';
import path from 'path';

export interface ICloudinaryResponse {
    format: string;
    public_id: string;
    resource_type: string;
    created_at: string;
    bytes: number;
    type: string;
    url: string;
    secure_url: string;
}

// cloudinary config
cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
    secure: config.nodeEnv === 'production',
});

export const sendPDFToCloudinary = async (
    pdfName: string,
    filePath: string,
): Promise<ICloudinaryResponse> => {
    return new Promise((resolve, reject) => {
        const pdfNameWithoutExt = pdfName.replace(path.extname(pdfName), '');

        cloudinary.uploader.upload(
            filePath,
            {
                folder: 'ODITI_PDF',
                public_id: pdfNameWithoutExt,
                resource_type: 'raw',
            },
            async (err, result) => {
                if (err) {
                    reject(
                        new AppError(
                            httpStatus.CONFLICT,
                            'PDF cannot upload',
                            err?.name,
                        ),
                    );
                }

                await fs.unlink(filePath, err => {
                    if (err) {
                        console.log({
                            status: 500,
                            success: false,
                            message: 'PDF cannot be deleted',
                            errorMessages: {
                                path: '/',
                                message: err?.message,
                            },
                            stack: err,
                        });
                    }
                });

                resolve(result as ICloudinaryResponse);
            },
        );
    });
};
