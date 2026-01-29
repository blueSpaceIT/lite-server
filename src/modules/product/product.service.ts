import httpStatus from 'http-status';
import generateID from '../../utils/generateID';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { IProduct } from './product.interface';
import { Product } from './product.model';
import { ProductCategory } from '../productCategory/productCategory.model';

// create product
const createProductIntoDB = async (payload: IProduct) => {
    // check product category
    const productCategory = await ProductCategory.findOne({
        id: payload.category,
        isDeleted: false,
    }).select('_id');
    if (!productCategory) {
        throw new AppError(httpStatus.NOT_FOUND, 'No category found');
    }

    // create product data
    const createProductData = {
        ...payload,
    };
    createProductData.id = await generateID(Product);
    createProductData.category = productCategory._id;

    const result = await Product.create(createProductData);
    return result;
};

// get all products
const getAllProductsFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        Product.find({ isDeleted: false }).populate('category'),
        query,
    )
        .search(['name', 'shortDescription'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return { result, meta };
};

// get single product
const getSingleProductFromDB = async (id: string) => {
    const result = await Product.findOne({ id, isDeleted: false }).populate(
        'category',
    );
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No product found');
    }
    return result;
};

// update product
const updateProductIntoDB = async (id: string, payload: Partial<IProduct>) => {
    const product = await Product.findOne({
        id,
        isDeleted: false,
    });
    if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, 'No product found');
    }

    if (payload?.name && payload.name === '') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Name cannot be empty');
    }

    if (payload?.image && payload.image === '') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Image cannot be empty');
    }

    const updatedProductData = {
        ...payload,
    };
    if (payload?.category) {
        // check product category
        const productCategory = await ProductCategory.findOne({
            id: payload.category,
            isDeleted: false,
        }).select('_id');
        if (!productCategory) {
            throw new AppError(httpStatus.NOT_FOUND, 'No category found');
        }
        updatedProductData.category = productCategory._id;
    }

    const result = await Product.findByIdAndUpdate(
        product._id,
        updatedProductData,
        { new: true },
    );
    return result;
};

// delete product
const deleteProductFromDB = async (id: string) => {
    const product = await Product.findOne({
        id,
        isDeleted: false,
    });
    if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, 'No product found');
    }

    const result = await Product.findByIdAndUpdate(
        product._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const ProductServices = {
    createProductIntoDB,
    getAllProductsFromDB,
    getSingleProductFromDB,
    updateProductIntoDB,
    deleteProductFromDB,
};
