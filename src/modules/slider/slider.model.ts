import { model, Schema } from 'mongoose';
import { ISlider, ISliderGallery } from './slider.interface';

const sliderSchema = new Schema<ISlider>(
    {
        id: {
            type: String,
            required: [true, 'User ID is required'],
            unique: true,
        },
        images: {
            type: [Schema.Types.ObjectId],
            required: [true, 'Images is required'],
            ref: 'SliderGallery',
        },
    },
    { timestamps: true },
);

const sliderGallerySchema = new Schema<ISliderGallery>(
    {
        id: {
            type: String,
            required: [true, 'User ID is required'],
            unique: true,
        },
        url: {
            type: String,
            required: [true, 'Url is required'],
        },
        destination: {
            type: String,
            required: [true, 'Destination URL is required'],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export const Slider = model<ISlider>('Slider', sliderSchema);
export const SliderGallery = model<ISliderGallery>(
    'SliderGallery',
    sliderGallerySchema,
);
