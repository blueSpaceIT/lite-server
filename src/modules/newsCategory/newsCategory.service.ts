import httpStatus from 'http-status';
import generateID from '../../utils/generateID';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { NewsCategory } from './newsCategory.model';
import { INewsCategory } from './newsCategory.interface';

// create news category
const createNewsCategoryIntoDB = async (payload: INewsCategory) => {
    // create news category data
    const createNewsCategoryData = {
        ...payload,
    };
    createNewsCategoryData.id = await generateID(NewsCategory);

    const result = await NewsCategory.create(createNewsCategoryData);
    return result;
};

// get all news categories
const getAllNewsCategoriesFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        NewsCategory.find({ isDeleted: false }),
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

// get single news category
const getSingleNewsCategoryFromDB = async (id: string) => {
    const result = await NewsCategory.findOne({ id, isDeleted: false });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No category found');
    }
    return result;
};

// update news category
const updateNewsCategoryIntoDB = async (
    id: string,
    payload: Partial<INewsCategory>,
) => {
    const newsCategory = await NewsCategory.findOne({
        id,
        isDeleted: false,
    });
    if (!newsCategory) {
        throw new AppError(httpStatus.NOT_FOUND, 'No category found');
    }

    if (payload?.name && payload.name === '') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Name cannot be empty');
    }

    const updatedNewsCategoryData = {
        ...payload,
    };

    const result = await NewsCategory.findByIdAndUpdate(
        newsCategory._id,
        updatedNewsCategoryData,
        { new: true },
    );
    return result;
};

// delete news category
const deleteNewsCategoryFromDB = async (id: string) => {
    const newsCategory = await NewsCategory.findOne({
        id,
        isDeleted: false,
    });
    if (!newsCategory) {
        throw new AppError(httpStatus.NOT_FOUND, 'No category found');
    }

    const result = await NewsCategory.findByIdAndUpdate(
        newsCategory._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const NewsCategoryServices = {
    createNewsCategoryIntoDB,
    getAllNewsCategoriesFromDB,
    getSingleNewsCategoryFromDB,
    updateNewsCategoryIntoDB,
    deleteNewsCategoryFromDB,
};
