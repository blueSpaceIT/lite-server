import httpStatus from 'http-status';
import { ISlider, ISliderGallery } from './slider.interface';
import generateID from '../../utils/generateID';
import { Slider, SliderGallery } from './slider.model';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';

// create slider gallery
const createSliderGalleryIntoDB = async (payload: ISliderGallery) => {
    const createSliderGalleryData = {
        ...payload,
    };
    createSliderGalleryData.id = await generateID(SliderGallery);

    const result = await SliderGallery.create(createSliderGalleryData);
    return result;
};

// create slider
const createSliderIntoDB = async (payload: ISlider) => {
    await Promise.all(
        payload.images.map(async item => {
            const sliderGallery = await SliderGallery.findById(item);
            if (!sliderGallery) {
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'No slider gallery found',
                );
            }
        }),
    );

    const createSliderData = {
        ...payload,
    };

    const result = await Slider.findOneAndUpdate(
        { id: createSliderData.id },
        createSliderData,
        { upsert: true, new: true },
    );
    return result;
};

// get all slider galleries
const getAllSliderGalleriesFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        SliderGallery.find({ isDeleted: false }),
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

// get single slider
const getSingleSliderFromDB = async (id: string) => {
    const result = await Slider.findOne({ id }).populate('images');
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No slider found');
    }
    return result;
};

// update slider gallery
const updateSliderGalleryIntoDB = async (
    id: string,
    payload: Partial<ISliderGallery>,
) => {
    const sliderGallery = await SliderGallery.findOne({ id, isDeleted: false });
    if (!sliderGallery) {
        throw new AppError(httpStatus.NOT_FOUND, 'No slider gallery found');
    }

    const updatedSliderGalleryData = {
        ...payload,
    };

    const result = await SliderGallery.findByIdAndUpdate(
        sliderGallery._id,
        updatedSliderGalleryData,
        { new: true },
    );
    return result;
};

// delete slider gallery
const deleteSliderGalleryFromDB = async (id: string) => {
    const sliderGallery = await SliderGallery.findOne({ id, isDeleted: false });
    if (!sliderGallery) {
        throw new AppError(httpStatus.NOT_FOUND, 'No slider gallery found');
    }

    const result = await SliderGallery.findByIdAndUpdate(
        sliderGallery._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const SliderServices = {
    createSliderGalleryIntoDB,
    createSliderIntoDB,
    getAllSliderGalleriesFromDB,
    getSingleSliderFromDB,
    updateSliderGalleryIntoDB,
    deleteSliderGalleryFromDB,
};
