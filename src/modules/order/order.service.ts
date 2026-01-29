import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { Order } from './order.model';
import { JwtPayload } from 'jsonwebtoken';
import { Student } from '../student/student.model';
import { IOrder } from './order.interface';
import generateOrderID from '../../utils/generateOrderID';
import { Product } from '../product/product.model';
import { Coupon } from '../coupon/coupon.model';
import sendSMS from '../../utils/sendSMS';

// create order
const createOrderIntoDB = async (payload: IOrder) => {
    const products = await Promise.all(
        payload.products.map(async item => {
            const product = await Product.findOne({
                id: item.product,
                isDeleted: false,
            }).select('_id');
            if (!product) {
                throw new AppError(httpStatus.NOT_FOUND, 'No product found');
            }

            return {
                product: product._id,
                price: item.price,
                quantity: item.quantity,
            };
        }),
    );

    const createOrderData: Partial<IOrder> = {
        id: await generateOrderID(Order),
        name: payload.name,
        phone: payload.phone,
        orderType: payload.orderType,
        payMethod:
            payload.orderType === 'ebook'
                ? 'Payment Gateway'
                : payload.payMethod,
        deliveryCharge: 0,
        products: products,
    };
    createOrderData.status = 'Pending';
    createOrderData.subtotal = products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
    );

    if (payload?.address) {
        createOrderData.address = payload.address;
    }
    if (payload?.area) {
        createOrderData.area = payload.area;
        createOrderData.deliveryCharge =
            payload.area === 'Dhaka'
                ? 70
                : payload.area === 'Dhaka Out'
                  ? 100
                  : 0;
    }
    if (payload?.discount) {
        createOrderData.discount = payload.discount;
    }

    createOrderData.totalAmount =
        Number(createOrderData.subtotal) +
        Number(createOrderData?.deliveryCharge || 0) -
        Number(createOrderData?.discount || 0);

    if (payload?.discountReason) {
        createOrderData.discountReason = payload.discountReason;
    }

    if (payload?.coupon) {
        // check coupon
        const coupon = await Coupon.findOne({
            id: payload.coupon,
            isDeleted: false,
        }).select('_id');
        if (!coupon) {
            throw new AppError(httpStatus.NOT_FOUND, 'No coupon found');
        }
        createOrderData.coupon = coupon._id;
    }

    const message = `Oditi New Order,\n New order received. Order ID: ${createOrderData.id}, Name: ${createOrderData.name}, Total Amount: ${createOrderData.totalAmount}`;
    await sendSMS(createOrderData.phone as string, message);

    const result = await Order.create(createOrderData);
    return result;
};

// get all orders
const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        Order.find({ isDeleted: false })
            .populate('coupon', '_id id name')
            .populate('products.product', '_id id name image fullPDF shortPDF'),
        query,
    )
        .search(['name', 'address'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return { result, meta };
};

// get all my orders
const getAllMyOrdersFromDB = async (
    userPayload: JwtPayload,
    query: Record<string, unknown>,
) => {
    // check student
    const student = await Student.findOne({
        id: userPayload.userID,
        isDeleted: false,
    }).select('phone');
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No student found');
    }

    const fetchQuery = new QueryBuilder(
        Order.find({
            phone: student.phone,
            isDeleted: false,
        })
            .populate('coupon', '_id id name')
            .populate('products.product', '_id id name image fullPDF shortPDF'),
        query,
    )
        .search(['name', 'address'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return { result, meta };
};

// get all my ebooks
const getAllMyEbooksFromDB = async (userPayload: JwtPayload) => {
    // check student
    const student = await Student.findOne({
        id: userPayload.userID,
        isDeleted: false,
    }).select('phone');
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No student found');
    }

    const orders = await Order.find({
        orderType: 'ebook',
        phone: student.phone,
        isDeleted: false,
    })
        .select('_id products.product')
        .populate('products.product', '_id id name image fullPDF');

    const ebooks = orders.map(order =>
        order.products.map(item => item.product),
    );
    const result = ebooks.flat();
    return result;
};

// get single order
const getSingleOrderFromDB = async (id: string) => {
    const result = await Order.findOne({ id, isDeleted: false })
        .populate('coupon', '_id id name')
        .populate('products.product', '_id id name image fullPDF shortPDF');
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No order found');
    }
    return result;
};

// get single valid order
const getSingleValidOrderFromDB = async (
    userPayload: JwtPayload,
    id: string,
) => {
    // check student
    const student = await Student.findOne({
        id: userPayload.userID,
        isDeleted: false,
    }).select('_id phone');
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No student found');
    }

    const order = await Order.findOne({
        id,
        phone: student.phone,
        isDeleted: false,
    })
        .populate('coupon', '_id id name')
        .populate('products.product', '_id id name image fullPDF shortPDF');
    if (!order) {
        throw new AppError(httpStatus.NOT_FOUND, 'No valid order found');
    }

    return order;
};

// update order
const updateOrderIntoDB = async (id: string, payload: Partial<IOrder>) => {
    const order = await Order.findOne({ id, isDeleted: false }).select(
        '_id paymentDetails',
    );
    if (!order) {
        throw new AppError(httpStatus.NOT_FOUND, 'No order found');
    }

    const updateOrderData: Partial<IOrder> = {};
    if (payload?.phone) {
        updateOrderData.phone = payload.phone;
    }
    if (payload?.address) {
        updateOrderData.address = payload.address;
    }
    if (payload?.area) {
        updateOrderData.area = payload.area;
        updateOrderData.deliveryCharge =
            payload.area === 'Dhaka'
                ? 60
                : payload.area === 'Dhaka Out'
                  ? 100
                  : 0;
    }
    if (payload?.status) {
        updateOrderData.status = payload.status;
    }
    if (payload?.payStatus) {
        updateOrderData.payStatus = payload.payStatus;
    }

    const prevPaymentDetails = order.paymentDetails || [];
    if (payload?.paymentDetails) {
        updateOrderData.paymentDetails = [
            ...prevPaymentDetails,
            ...payload.paymentDetails,
        ];
    }

    const result = await Order.findByIdAndUpdate(order._id, updateOrderData, {
        new: true,
    });
    return result;
};

// delete order
const deleteOrderFromDB = async (id: string) => {
    const order = await Order.findOne({ id, isDeleted: false }).select('_id');
    if (!order) {
        throw new AppError(httpStatus.NOT_FOUND, 'No order found');
    }

    const result = await Order.findByIdAndUpdate(
        order._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const OrderServices = {
    createOrderIntoDB,
    getAllOrdersFromDB,
    getAllMyOrdersFromDB,
    getAllMyEbooksFromDB,
    getSingleOrderFromDB,
    getSingleValidOrderFromDB,
    updateOrderIntoDB,
    deleteOrderFromDB,
};
