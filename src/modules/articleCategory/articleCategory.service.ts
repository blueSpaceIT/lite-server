import httpStatus from 'http-status';
import { IArticleCategory } from './articleCategory.interface';
import { ArticleCategory } from './articleCategory.model';
import generateID from '../../utils/generateID';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';

// create article category
const createArticleCategoryIntoDB = async (payload: IArticleCategory) => {
    // create article category data
    const createArticleCategoryData = {
        ...payload,
    };
    createArticleCategoryData.id = await generateID(ArticleCategory);

    const result = await ArticleCategory.create(createArticleCategoryData);
    return result;
};

// get all article categories
const getAllArticleCategoriesFromDB = async (
    query: Record<string, unknown>,
) => {
    const fetchQuery = new QueryBuilder(
        ArticleCategory.find({ isDeleted: false }),
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

// get single article category
const getSingleArticleCategoryFromDB = async (id: string) => {
    const result = await ArticleCategory.findOne({ id, isDeleted: false });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No category found');
    }
    return result;
};

// update article category
const updateArticleCategoryIntoDB = async (
    id: string,
    payload: Partial<IArticleCategory>,
) => {
    const articleCategory = await ArticleCategory.findOne({
        id,
        isDeleted: false,
    });
    if (!articleCategory) {
        throw new AppError(httpStatus.NOT_FOUND, 'No category found');
    }

    if (payload?.name && payload.name === '') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Name cannot be empty');
    }

    const updatedArticleCategoryData = {
        ...payload,
    };

    const result = await ArticleCategory.findByIdAndUpdate(
        articleCategory._id,
        updatedArticleCategoryData,
        { new: true },
    );
    return result;
};

// delete article category
const deleteArticleCategoryFromDB = async (id: string) => {
    const articleCategory = await ArticleCategory.findOne({
        id,
        isDeleted: false,
    });
    if (!articleCategory) {
        throw new AppError(httpStatus.NOT_FOUND, 'No category found');
    }

    const result = await ArticleCategory.findByIdAndUpdate(
        articleCategory._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const ArticleCategoryServices = {
    createArticleCategoryIntoDB,
    getAllArticleCategoriesFromDB,
    getSingleArticleCategoryFromDB,
    updateArticleCategoryIntoDB,
    deleteArticleCategoryFromDB,
};
