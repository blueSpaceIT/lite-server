import httpStatus from 'http-status';
import generateID from '../../utils/generateID';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { ProductCategory } from './productCategory.model';
import { IProductCategory } from './productCategory.interface';

// create product category
const createProductCategoryIntoDB = async (payload: IProductCategory) => {
    // create product category data
    const createProductCategoryData = {
        ...payload,
    };
    createProductCategoryData.id = await generateID(ProductCategory);

    const result = await ProductCategory.create(createProductCategoryData);
    return result;
};

// get all product categories
const getAllProductCategoriesFromDB = async (
    query: Record<string, unknown>,
) => {
    const fetchQuery = new QueryBuilder(
        ProductCategory.find({ isDeleted: false }),
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

// get single product category
const getSinglProductCategoryFromDB = async (id: string) => {
    const result = await ProductCategory.findOne({ id, isDeleted: false });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No category found');
    }
    return result;
};

// update product category
const updateProductCategoryIntoDB = async (
    id: string,
    payload: Partial<IProductCategory>,
) => {
    const productCategory = await ProductCategory.findOne({
        id,
        isDeleted: false,
    });
    if (!productCategory) {
        throw new AppError(httpStatus.NOT_FOUND, 'No category found');
    }

    if (payload?.name && payload.name === '') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Name cannot be empty');
    }

    const updatedProductCategoryData = {
        ...payload,
    };

    const result = await ProductCategory.findByIdAndUpdate(
        productCategory._id,
        updatedProductCategoryData,
        { new: true },
    );
    return result;
};

// delete product category
const deleteProductCategoryFromDB = async (id: string) => {
    const productCategory = await ProductCategory.findOne({
        id,
        isDeleted: false,
    });
    if (!productCategory) {
        throw new AppError(httpStatus.NOT_FOUND, 'No category found');
    }

    const result = await ProductCategory.findByIdAndUpdate(
        productCategory._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const ProductCategoryServices = {
    createProductCategoryIntoDB,
    getAllProductCategoriesFromDB,
    getSinglProductCategoryFromDB,
    updateProductCategoryIntoDB,
    deleteProductCategoryFromDB,
};
