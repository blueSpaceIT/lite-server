import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { ITag } from './tag.interface';
import { Tag } from './tag.model';
import generateID from '../../utils/generateID';

const createTagIntoDB = async (payload: ITag) => {
    const createTagData = {
        ...payload,
    };
    createTagData.id = await generateID(Tag);
    const result = await Tag.create(createTagData);
    return result;
};

const getAllTagsFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(Tag.find({ isDeleted: false }), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return { result, meta };
};

const getSingleTagFromDB = async (id: string) => {
    const result = await Tag.findOne({ id, isDeleted: false });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No tag found');
    }
    return result;
};

const updateTagIntoDB = async (id: string, payload: Partial<ITag>) => {
    const tag = await Tag.findOne({ id, isDeleted: false }).select('_id');
    if (!tag) {
        throw new AppError(httpStatus.NOT_FOUND, 'No tag found');
    }
    const result = await Tag.findByIdAndUpdate(tag._id, payload, {
        new: true,
    });
    return result;
};

const deleteTagFromDB = async (id: string) => {
    const tag = await Tag.findOne({ id, isDeleted: false }).select('_id');
    if (!tag) {
        throw new AppError(httpStatus.NOT_FOUND, 'No tag found');
    }
    const result = await Tag.findByIdAndUpdate(
        tag._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const TagServices = {
    createTagIntoDB,
    getAllTagsFromDB,
    getSingleTagFromDB,
    updateTagIntoDB,
    deleteTagFromDB,
};
