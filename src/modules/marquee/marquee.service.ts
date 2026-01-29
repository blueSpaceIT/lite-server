import httpStatus from 'http-status';
import { IMarquee } from './marquee.interface';
import { Marquee } from './marquee.model';
import AppError from '../../errors/AppError';

// create marquee
const createMarqueeIntoDB = async (payload: IMarquee) => {
    const createMarqueeData = {
        ...payload,
    };
    createMarqueeData.id = 'marquee';

    const result = await Marquee.findOneAndUpdate(
        { id: createMarqueeData.id },
        createMarqueeData,
        { upsert: true, new: true },
    );
    return result;
};

// get single marquee
const getSingleMarqueeFromDB = async (id: string) => {
    const result = await Marquee.findOne({ id });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No marquee found');
    }
    return result;
};

export const MarqueeServices = {
    createMarqueeIntoDB,
    getSingleMarqueeFromDB,
};
