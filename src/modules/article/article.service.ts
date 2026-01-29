import httpStatus from 'http-status';
import generateID from '../../utils/generateID';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { IArticle } from './article.interface';
import { Article } from './article.model';
import { ArticleCategory } from '../articleCategory/articleCategory.model';
import { Admin } from '../admin/admin.model';

// create article
const createArticleIntoDB = async (payload: IArticle) => {
    // check category
    const category = await ArticleCategory.findOne({
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

    // create article data
    const createArticleData = {
        ...payload,
    };
    createArticleData.id = await generateID(Article);
    createArticleData.category = category._id;
    createArticleData.author = user._id;

    const result = await Article.create(createArticleData);
    return result;
};

// get all articles
const getAllArticlesFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        Article.find({ isDeleted: false })
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

// get single article
const getSingleArticleFromDB = async (id: string) => {
    const result = await Article.findOne({ id, isDeleted: false })
        .populate('category', '_id id name')
        .populate('author', '_id id name');
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No article found');
    }
    return result;
};

// update article
const updateArticleIntoDB = async (id: string, payload: Partial<IArticle>) => {
    const article = await Article.findOne({ id, isDeleted: false });
    if (!article) {
        throw new AppError(httpStatus.NOT_FOUND, 'No article found');
    }

    if (payload?.name && payload.name === '') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Name cannot be empty');
    }

    const updatedArticleData = {
        ...payload,
    };

    if (payload?.category) {
        // check category
        const category = await ArticleCategory.findOne({
            id: payload.category,
            isDeleted: false,
        });
        if (!category) {
            throw new AppError(httpStatus.NOT_FOUND, 'No category found');
        }
        updatedArticleData.category = category._id;
    }

    const result = await ArticleCategory.findByIdAndUpdate(
        article._id,
        updatedArticleData,
        { new: true },
    );
    return result;
};

// delete article
const deleteArticleFromDB = async (id: string) => {
    const article = await Article.findOne({ id, isDeleted: false });
    if (!article) {
        throw new AppError(httpStatus.NOT_FOUND, 'No article found');
    }

    const result = await Article.findByIdAndUpdate(
        article._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const ArticleServices = {
    createArticleIntoDB,
    getAllArticlesFromDB,
    getSingleArticleFromDB,
    updateArticleIntoDB,
    deleteArticleFromDB,
};
