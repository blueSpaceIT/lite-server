import { Request, Response } from 'express';
import fs from 'fs';
import httpStatus from 'http-status';
import path from 'path';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import { buildUploadPath, toPublicPath } from './mediaPath';

export const finalizeUpload = catchAsync(
    async (req: Request, res: Response) => {
        const { uploadId, fileName } = req.body;

        if (!uploadId || !fileName) {
            return sendResponse(res, {
                status: httpStatus.BAD_REQUEST,
                success: false,
                message: 'uploadId and fileName are required',
                data: null,
            });
        }

        const tempDir = buildUploadPath(`videos/.tmp/${uploadId}`);
        const finalDir = buildUploadPath('videos');

        if (!fs.existsSync(tempDir)) {
            return sendResponse(res, {
                status: httpStatus.BAD_REQUEST,
                success: false,
                message: 'No uploaded chunks found',
                data: null,
            });
        }

        fs.mkdirSync(finalDir, { recursive: true });

        const finalPath = path.join(finalDir, fileName);
        const writeStream = fs.createWriteStream(finalPath);

        const chunkFiles = fs
            .readdirSync(tempDir)
            .filter(f => f.endsWith('.part'))
            .sort((a, b) => Number(a.split('.')[0]) - Number(b.split('.')[0]));

        if (!chunkFiles.length) {
            throw new Error('No chunks to merge');
        }

        for (const chunk of chunkFiles) {
            const chunkPath = path.join(tempDir, chunk);
            writeStream.write(fs.readFileSync(chunkPath));
            fs.unlinkSync(chunkPath);
        }

        writeStream.end();
        fs.rmSync(tempDir, { recursive: true, force: true });

        sendResponse(res, {
            status: httpStatus.OK,
            success: true,
            message: 'Upload finalized successfully',
            data: {
                videoUrl: toPublicPath(finalPath),
                server: 'Other',
            },
        });
    },
);
