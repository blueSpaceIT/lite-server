import httpStatus from 'http-status';
import generateID from '../../utils/generateID';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { IModule } from './module.interface';
import { Module } from './module.model';
import { Course } from '../course/course.model';

// create module
const createModuleIntoDB = async (payload: IModule) => {
    // check course
    const course = await Course.findOne({
        id: payload.course,
        isDeleted: false,
    }).select('_id');
    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course found');
    }

    // create module data
    const createModuleData = {
        ...payload,
    };
    createModuleData.id = await generateID(Module);
    createModuleData.course = course._id;

    const result = await Module.create(createModuleData);
    return result;
};

// get all modules
const getAllModulesFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        Module.find({ isDeleted: false }).populate('course'),
        query,
    )
        .search(['name'])
        .filter()
        .sort()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return {
        result,
        meta: {
            limit: meta.totalDoc,
            page: 1,
            totalPage: 1,
            totalDoc: meta.totalDoc,
        },
    };
};

// get single module
const getSingleModuleFromDB = async (id: string) => {
    const result = await Module.findOne({ id, isDeleted: false }).populate(
        'course',
    );
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No module found');
    }
    return result;
};

// update module
const updateModuleIntoDB = async (id: string, payload: Partial<IModule>) => {
    const module = await Module.findOne({
        id,
        isDeleted: false,
    });
    if (!module) {
        throw new AppError(httpStatus.NOT_FOUND, 'No module found');
    }

    if (payload?.name && payload.name === '') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Name cannot be empty');
    }

    const updatedModuleData = {
        ...payload,
    };

    const result = await Module.findByIdAndUpdate(
        module._id,
        updatedModuleData,
        { new: true },
    );
    return result;
};

// delete module
const deleteModuleFromDB = async (id: string) => {
    const module = await Module.findOne({
        id,
        isDeleted: false,
    });
    if (!module) {
        throw new AppError(httpStatus.NOT_FOUND, 'No module found');
    }

    const result = await Module.findByIdAndUpdate(
        module._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const ModuleServices = {
    createModuleIntoDB,
    getAllModulesFromDB,
    getSingleModuleFromDB,
    updateModuleIntoDB,
    deleteModuleFromDB,
};
