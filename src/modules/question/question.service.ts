import httpStatus from 'http-status';
import generateID from '../../utils/generateID';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TQuestion } from './question.interface';
import { Question } from './question.model';
import { Tag } from '../tag/tag.model';
import { Admin } from '../admin/admin.model';
import { JwtPayload } from 'jsonwebtoken';

// create question
const createQuestionIntoDB = async (
    userData: JwtPayload,
    payload: TQuestion,
) => {
    // check user
    const user = await Admin.findOne({ id: userData.userID, isDeleted: false });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'No user found');
    }

    // create question data
    const createQuestionData = {
        ...payload,
    };
    createQuestionData.id = await generateID(Question);
    createQuestionData.createdBy = user._id;

    // check tags
    if (payload.tags && payload.tags.length > 0) {
        const tags = await Promise.all(
            payload.tags.map(async item => {
                const tag = await Tag.findOne({
                    id: item,
                    isDeleted: false,
                }).select('_id');
                if (!tag) {
                    throw new AppError(httpStatus.NOT_FOUND, 'No tag found');
                }

                return tag._id;
            }),
        );
        createQuestionData.tags = tags;
    }

    const result = await Question.create(createQuestionData);
    return result;
};

// get all questions
const getAllQuestionsFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        Question.find({ isDeleted: false })
            .populate('tags', '_id id name')
            .populate('createdBy', '_id id name'),
        query,
    )
        .search(['question'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return { result, meta };
};

// get all questions by tags
const getAllQuestionsByTagsFromDB = async (query: Record<string, unknown>) => {
    const type = (query?.type as 'MCQ' | 'CQ' | 'GAPS') || null;
    const searchTerm = (query?.searchTerm as string) || null;
    const tags = query?.tags as string[] | null;
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 20;
    const skip = (page - 1) * limit;

    const filters: Record<string, unknown> = { isDeleted: false };
    if (type) {
        filters.type = type;
    }
    if (searchTerm) {
        filters.question = { $regex: searchTerm, $options: 'i' };
    }
    if (tags && tags.length > 0) {
        filters.tags = { $in: tags };
    }

    const result = await Question.find(filters)
        .skip(skip)
        .limit(limit)
        .populate('tags', '_id id name')
        .populate('createdBy', '_id id name');

    const totalDoc = await Question.countDocuments(filters);
    const totalPage = Math.max(1, Math.ceil(totalDoc / limit));

    return { result, meta: { page, limit, totalPage, totalDoc } };
};

// get all questions by tags in depth
const getAllQuestionsByTagsInDepthFromDB = async (
    query: Record<string, unknown>,
) => {
    const type = (query?.type as 'MCQ' | 'CQ' | 'GAPS') || null;
    const searchTerm = (query?.searchTerm as string) || null;
    const tags = query?.tags as string[] | null;
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 20;
    const skip = (page - 1) * limit;

    const filters: Record<string, unknown> = { isDeleted: false };
    if (type) {
        filters.type = type;
    }
    if (searchTerm) {
        filters.question = { $regex: searchTerm, $options: 'i' };
    }
    if (tags && tags.length > 0) {
        filters.tags = { $all: tags };
    }

    const result = await Question.find(filters)
        .skip(skip)
        .limit(limit)
        .populate('tags', '_id id name')
        .populate('createdBy', '_id id name');

    const totalDoc = await Question.countDocuments(filters);
    const totalPage = Math.max(1, Math.ceil(totalDoc / limit));

    return { result, meta: { page, limit, totalPage, totalDoc } };
};

// get single question
const getSingleQuestionFromDB = async (id: string) => {
    const result = await Question.findOne({ id, isDeleted: false })
        .populate('tags')
        .populate('createdBy');
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No question found');
    }
    return result;
};

// update question
const updateQuestionIntoDB = async (
    id: string,
    payload: Partial<TQuestion>,
) => {
    const question = await Question.findOne({ id, isDeleted: false });
    if (!question) {
        throw new AppError(httpStatus.NOT_FOUND, 'No question found');
    }

    if (payload?.question && payload.question === '') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Question cannot be empty');
    }

    const updatedQuestionData = {
        ...payload,
    };

    // check tags
    if (payload.tags && payload.tags.length > 0) {
        const tags = await Promise.all(
            payload.tags.map(async item => {
                const tag = await Tag.findOne({
                    id: item,
                    isDeleted: false,
                }).select('_id');
                if (!tag) {
                    throw new AppError(httpStatus.NOT_FOUND, 'No tag found');
                }

                return tag._id;
            }),
        );
        updatedQuestionData.tags = tags;
    }

    const result = await Question.findByIdAndUpdate(
        question._id,
        updatedQuestionData,
        { new: true },
    );
    return result;
};

// delete question
const deleteQuestionFromDB = async (id: string) => {
    const question = await Question.findOne({
        id,
        isDeleted: false,
    });
    if (!question) {
        throw new AppError(httpStatus.NOT_FOUND, 'No question found');
    }

    const result = await Question.findByIdAndUpdate(
        question._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const QuestionServices = {
    createQuestionIntoDB,
    getAllQuestionsFromDB,
    getAllQuestionsByTagsFromDB,
    getAllQuestionsByTagsInDepthFromDB,
    getSingleQuestionFromDB,
    updateQuestionIntoDB,
    deleteQuestionFromDB,
};
