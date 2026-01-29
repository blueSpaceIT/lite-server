import httpStatus from 'http-status';
import generateID from '../../utils/generateID';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { ICourseCategory } from './courseCategory.interface';
import { CourseCategory } from './courseCategory.model';

// create course category
const createCourseCategoryIntoDB = async (payload: ICourseCategory) => {
    // create course category data
    const createCourseCategoryData = {
        ...payload,
    };
    createCourseCategoryData.id = await generateID(CourseCategory);

    const result = await CourseCategory.create(createCourseCategoryData);
    return result;
};

// get all course categories
const getAllCourseCategoriesFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        CourseCategory.find({ isDeleted: false }),
        query,
    )
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return { result, meta };
};

// get single course category
const getSingleCourseCategoryFromDB = async (id: string) => {
    const result = await CourseCategory.findOne({ id, isDeleted: false });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No category found');
    }
    return result;
};

// update course category
const updateCourseCategoryIntoDB = async (
    id: string,
    payload: Partial<ICourseCategory>,
) => {
    const courseCategory = await CourseCategory.findOne({
        id,
        isDeleted: false,
    });
    if (!courseCategory) {
        throw new AppError(httpStatus.NOT_FOUND, 'No category found');
    }

    if (payload?.name && payload.name === '') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Name cannot be empty');
    }

    const updatedCourseCategoryData = {
        ...payload,
    };

    const result = await CourseCategory.findByIdAndUpdate(
        courseCategory._id,
        updatedCourseCategoryData,
        { new: true },
    );
    return result;
};

// delete course category
const deleteCourseCategoryFromDB = async (id: string) => {
    const courseCategory = await CourseCategory.findOne({
        id,
        isDeleted: false,
    });
    if (!courseCategory) {
        throw new AppError(httpStatus.NOT_FOUND, 'No category found');
    }

    const result = await CourseCategory.findByIdAndUpdate(
        courseCategory._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const CourseCategoryServices = {
    createCourseCategoryIntoDB,
    getAllCourseCategoriesFromDB,
    getSingleCourseCategoryFromDB,
    updateCourseCategoryIntoDB,
    deleteCourseCategoryFromDB,
};
