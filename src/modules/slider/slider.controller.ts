import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SliderServices } from './slider.service';

// create slider gallery controller
const createSliderGallery = catchAsync(async (req, res) => {
    const result = await SliderServices.createSliderGalleryIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Slider gallery has been created successfully',
        data: result,
    });
});

// create slider controller
const createSlider = catchAsync(async (req, res) => {
    const result = await SliderServices.createSliderIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Slider has been created successfully',
        data: result,
    });
});

// get all slider galleries controller
const getAllSliderGalleries = catchAsync(async (req, res) => {
    const result = await SliderServices.getAllSliderGalleriesFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'All slider galleries have been retrieved successfully',
        data: result,
    });
});

// get single slider controller
const getSingleSlider = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SliderServices.getSingleSliderFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Slider has been retrieved successfully',
        data: result,
    });
});

// update slider gallery controller
const updateSliderGallery = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SliderServices.updateSliderGalleryIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Slider gallery has been updated successfully',
        data: result,
    });
});

// delete slider gallery controller
const deleteSliderGallery = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SliderServices.deleteSliderGalleryFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Slider gallery has been deleted successfully',
        data: result,
    });
});

export const SliderControllers = {
    createSliderGallery,
    createSlider,
    getAllSliderGalleries,
    getSingleSlider,
    updateSliderGallery,
    deleteSliderGallery,
};
