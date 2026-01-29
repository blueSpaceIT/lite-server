import httpStatus from 'http-status';
import generateID from '../../utils/generateID';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { Admin } from '../admin/admin.model';
import { INews } from './news.interface';
import { NewsCategory } from '../newsCategory/newsCategory.model';
import { News } from './news.model';

// create news
const createNewsIntoDB = async (payload: INews) => {
    // check category
    const category = await NewsCategory.findOne({
        id: payload.category,
        isDeleted: false,
    });
    if (!category) {
        throw new AppError(httpStatus.NOT_FOUND, 'No category found');
    }

    // check user
    const user = await Admin.findOne({
        id: payload.author,
        isDeleted: false,
    });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'No user found');
    }

    // create news data
    const createNewsData = {
        ...payload,
    };
    createNewsData.id = await generateID(News);
    createNewsData.category = category._id;
    createNewsData.author = user._id;

    const result = await News.create(createNewsData);
    return result;
};

// get all news
const getAllNewsFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        News.find({ isDeleted: false })
            .populate('category', '_id id name')
            .populate('author', '_id id name'),
        query,
    )
        .search(['name', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return { result, meta };
};

// get news news
const getSingleNewsFromDB = async (id: string) => {
    const result = await News.findOne({ id, isDeleted: false })
        .populate('category', '_id id name')
        .populate('author', '_id id name');
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No news found');
    }
    return result;
};

// update news
const updateNewsIntoDB = async (id: string, payload: Partial<INews>) => {
    const news = await News.findOne({ id, isDeleted: false });
    if (!news) {
        throw new AppError(httpStatus.NOT_FOUND, 'No news found');
    }

    if (payload?.name && payload.name === '') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Name cannot be empty');
    }

    const updatedNewsData = {
        ...payload,
    };

    if (payload?.category) {
        // check category
        const category = await NewsCategory.findOne({
            id: payload.category,
            isDeleted: false,
        });
        if (!category) {
            throw new AppError(httpStatus.NOT_FOUND, 'No category found');
        }
        updatedNewsData.category = category._id;
    }

    const result = await NewsCategory.findByIdAndUpdate(
        news._id,
        updatedNewsData,
        { new: true },
    );
    return result;
};

// delete news
const deleteNewsFromDB = async (id: string) => {
    const news = await News.findOne({ id, isDeleted: false });
    if (!news) {
        throw new AppError(httpStatus.NOT_FOUND, 'No news found');
    }

    const result = await News.findByIdAndUpdate(
        news._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const NewsServices = {
    createNewsIntoDB,
    getAllNewsFromDB,
    getSingleNewsFromDB,
    updateNewsIntoDB,
    deleteNewsFromDB,
};
