import fs from 'fs';
import httpStatus from 'http-status';
import path from 'path';
import { pipeline } from 'stream';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import { buildUploadPath } from '../../utils/mediaPath';
import sendResponse from '../../utils/sendResponse';
import { MediaServices } from './media.service';

// create media controller
const createMedia = catchAsync(async (req, res) => {
    const { width, height } = req.params;
    const result = await MediaServices.createMediaIntoDB(
        { width, height },
        req.file as Express.Multer.File,
        req.user,
    );
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Media has been created successfully',
        data: result,
    });
});

// upload pdf controller
const uploadPDF = catchAsync(async (req, res) => {
    const result = await MediaServices.PDFUploadService(
        req.file as Express.Multer.File,
    );
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'PDF has been uploaded successfully',
        data: result,
    });
});

// get all media controller
const getAllMedia = catchAsync(async (req, res) => {
    const result = await MediaServices.getAllMediaFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All media have been retrieved successfully',
        data: result,
    });
});

// get single media controller
const getSingleMedia = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await MediaServices.getSingleMediaFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Media has been retrieved successfully',
        data: result,
    });
});

// delete media controller
const deleteMedia = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await MediaServices.deleteMediaFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Media has been deleted successfully',
        data: result,
    });
});

const createVideo = catchAsync(async (req, res) => {
    const result = await MediaServices.createVideoIntoDB(req.body);

    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Video has been created successfully',
        data: result,
    });
});

const mergeChunks = catchAsync(async (req, res) => {
    const { uploadId, totalChunks } = req.body;

    if (!uploadId || !totalChunks) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'uploadId & totalChunks are required',
        );
    }

    const tempDir = buildUploadPath(`videos/.tmp/${uploadId}`);
    const finalDir = buildUploadPath('videos/final');
    fs.mkdirSync(finalDir, { recursive: true });

    const finalFilePath = path.join(finalDir, `${uploadId}.mp4`);
    const writeStream = fs.createWriteStream(finalFilePath);

    // ✅ sequentially append chunks
    for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join(tempDir, `${i}.part`);

        if (!fs.existsSync(chunkPath)) {
            throw new AppError(httpStatus.BAD_REQUEST, `Missing chunk ${i}`);
        }

        await pipeline(fs.createReadStream(chunkPath), writeStream);

        fs.unlinkSync(chunkPath);
    }

    writeStream.end();

    // cleanup
    fs.rmdirSync(tempDir);

    const video = await MediaServices.createVideoIntoDB({
        url: `/uploads/videos/final/${uploadId}.mp4`,
        type: 'video',
    });

    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Video uploaded successfully',
        data: video,
    });
});

export const MediaControllers = {
    createMedia,
    uploadPDF,
    getAllMedia,
    getSingleMedia,
    deleteMedia,
    createVideo,
    mergeChunks,
};
