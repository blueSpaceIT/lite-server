import fs from 'fs';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import generateID from '../../utils/generateID';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { sendPDFToCloudinary } from '../../utils/sendPDFToCloudinary';
import { Admin } from '../admin/admin.model';
import { Student } from '../student/student.model';
import { IMedia, IVideo } from './media.interface';
import { Media, VideoModel } from './media.model';

// create media
const createMediaIntoDB = async (
    params: { width: string; height: string },
    payload: Express.Multer.File,
    userPayload: JwtPayload,
) => {
    if (!payload?.path) {
        throw new AppError(httpStatus.NOT_FOUND, 'No media found');
    }

    let user = null;
    if (userPayload.role !== 'student') {
        user = await Admin.findOne({
            id: userPayload.userID,
            isDeleted: false,
        });
    } else {
        user = await Student.findOne({
            id: userPayload.userID,
            isDeleted: false,
        });
    }

    if (!user) {
        await fs.unlink(payload.path, err => {
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

        throw new AppError(httpStatus.NOT_FOUND, 'No user found');
    }

    const imageName = 'IMG_ODITI_' + String(new Date().getTime());

    // send media to cloudinary
    const mediaData = await sendImageToCloudinary(imageName, payload.path, {
        width: Number(params.width),
        height:
            params.height === 'auto' ? params.height : Number(params.height),
    });
    if (!mediaData?.secure_url) {
        throw new AppError(httpStatus.NOT_FOUND, 'Media upload failed');
    }

    // create media data
    const createMediaData: Partial<IMedia> = {
        url: mediaData.secure_url,
    };
    createMediaData.id = await generateID(Media);
    if (userPayload.role !== 'student') {
        createMediaData.admin = user._id;
    } else {
        createMediaData.student = user._id;
    }

    const result = await Media.create(createMediaData);
    return result;
};

// pdf upload
const PDFUploadService = async (payload: Express.Multer.File) => {
    const pdfName = 'PDF_ODITI_' + String(new Date().getTime());

    // send media to cloudinary
    const mediaData = await sendPDFToCloudinary(pdfName, payload.path);
    if (!mediaData?.secure_url) {
        throw new AppError(httpStatus.NOT_FOUND, 'Media upload failed');
    }
    return { result: mediaData.secure_url };
};

// get all media
const getAllMediaFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        Media.find({ isDeleted: false }).populate('admin'),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return { result, meta };
};

// get single media
const getSingleMediaFromDB = async (id: string) => {
    const result = await Media.findOne({ id, isDeleted: false }).populate(
        'admin',
    );
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No media found');
    }
    return result;
};

// delete media
const deleteMediaFromDB = async (id: string) => {
    const media = await Media.findOne({ id, isDeleted: false });
    if (!media) {
        throw new AppError(httpStatus.NOT_FOUND, 'No media found');
    }

    const result = await Media.findByIdAndUpdate(
        media._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

const createVideoIntoDB = async (
    payload: Partial<IVideo>
) => {
    const result = await VideoModel.create(payload);
    return result;
};

export const MediaServices = {
    createMediaIntoDB,
    PDFUploadService,
    getAllMediaFromDB,
    getSingleMediaFromDB,
    deleteMediaFromDB,
    createVideoIntoDB,
};
