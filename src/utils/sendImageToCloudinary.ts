import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import multer, { Multer } from 'multer';
import path from 'path';
import fs from 'fs';

export interface ICloudinaryResponse {
    format: string;
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

export const sendImageToCloudinary = async (
    imageName: string,
    path: string,
    size: { width: number; height: number | string },
): Promise<ICloudinaryResponse> => {
    const transformation: Record<string, unknown> = {
        crop: 'fill',
        width: size.width,
        quality: 90,
        fetch_format: 'auto',
    };

    if (size.height !== 'auto') {
        transformation.height = size.height;
    }

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            path,
            {
                folder: 'ODITI',
                public_id: imageName,
                transformation,
            },
            async (err, result) => {
                if (err) {
                    reject(
                        new AppError(
                            httpStatus.CONFLICT,
                            'Image cannot upload',
                            err?.name,
                        ),
                    );
                }

                await fs.unlink(path, err => {
                    if (err) {
                        console.log({
                            status: 500,
                            success: false,
                            message: 'Image cannot be deleted',
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    },
});

export const upload: Multer = multer({ storage: storage });
