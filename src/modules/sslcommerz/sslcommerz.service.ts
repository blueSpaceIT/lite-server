import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import prepareSSLCommerzData from '../../utils/prepareSSLCommerzData';
import {
    ISSLCommerzPaymentRequest,
    ISSLCommerzPaymentResponse,
    ISSLCommerzVerifyResponse,
} from './sslcommerz.interface';
import config from '../../config';
import { Purchase } from '../purchase/purchase.model';
import { Order } from '../order/order.model';
import generateID from '../../utils/generateID';
import { Account } from '../account/account.model';
import { IAccount } from '../account/account.interface';
import { Types } from 'mongoose';
import generatePurchaseID from '../../utils/generatePurchaseID';
import { ICourse } from '../course/course.interface';
import { IBranch } from '../branch/branch.interface';

// create payment
const createPaymentRequest = async (payload: ISSLCommerzPaymentRequest) => {
    const initializedData = prepareSSLCommerzData(payload);
    const formData = new URLSearchParams(initializedData);

    // https://sandbox.sslcommerz.com

    try {
        const response = await fetch(
            'https://securepay.sslcommerz.com/gwprocess/v4/api.php',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            },
        );

        const data: ISSLCommerzPaymentResponse = await response.json();
        if (data.status !== 'SUCCESS') {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to create payment request',
            );
        }
        return data;
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Failed to create payment request',
                err.stack,
            );
        } else {
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Failed to create payment request',
            );
        }
    }
};

// verify payment
const verifyPaymentRequest = async (
    type: string,
    payload: { val_id: string },
) => {
    const val_id = payload.val_id;

    try {
        const response = await fetch(
            'https://securepay.sslcommerz.com' +
                '/validator/api/validationserverAPI.php?' +
                `val_id=${val_id}&store_id=${config.sslcommerzStoreID}&store_passwd=${config.sslcommerzStorePass}&v=1&format=json`,
            { method: 'GET' },
        );

        const data: ISSLCommerzVerifyResponse = await response.json();
        if (data.status !== 'VALID' && data.status !== 'VALIDATED') {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to verify payment request',
            );
        }

        const params = new URLSearchParams(
            Object.entries(data).map(([key, value]) => [key, String(value)]),
        );

        let redirectUrl = `https://oditicareer.com/sslcommerz/${type}?${params.toString()}`;

        const createAccountData: Partial<IAccount> = {
            id: await generateID(Account),
            type: 'Earning',
            reason: ['Unknown From Gateway'],
            method: 'SSLCommerz',
            amount: Number(data.amount),
            branch: new Types.ObjectId('693166f5f52406266ee8b4f2'),
        };

        if (type === 'purchase') {
            // check purchase
            const purchase = await Purchase.findById(data.tran_id)
                .select('_id id branch course totalAmount')
                .populate<{
                    branch: IBranch & { _id: Types.ObjectId };
                }>('branch', '_id name code')
                .populate<{
                    course: ICourse & { _id: Types.ObjectId };
                }>('course', '_id name code typeCode');
            if (!purchase) {
                throw new AppError(httpStatus.NOT_FOUND, 'No purchase found');
            }

            createAccountData.reason = [purchase.course?.name];

            if (purchase.totalAmount !== Number(data.amount)) {
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'Wrong amount transaction found',
                );
            }

            const purchaseID = await generatePurchaseID(
                purchase.branch,
                purchase.course,
            );

            const updatedPurchaseData = {
                id: purchaseID,
                status: 'Active',
                payStatus: 'Paid',
                paidAmount: purchase.totalAmount,
                paymentDetails: [
                    {
                        method: 'SSLCommerz',
                        amount: purchase.totalAmount,
                        paidAt: new Date(),
                    },
                ],
            };

            const PurchaseUpdate = await Purchase.findByIdAndUpdate(
                purchase._id,
                updatedPurchaseData,
                { new: true },
            );
            if (!PurchaseUpdate) {
                console.log('Failed to update purchase: ', purchase.id);
                redirectUrl = `https://oditicareer.com/sslcommerz/${type}?status=FAILED&tran_id=${data.tran_id}`;
            }
        }

        if (type === 'order') {
            // check order
            const order = await Order.findOne({
                id: data.tran_id,
            })
                .select('_id id products totalAmount')
                .populate<{
                    products: {
                        product: { _id: string; name: string };
                        price: number;
                        quantity: number;
                    }[];
                }>('products.product', '_id name');
            if (!order) {
                throw new AppError(httpStatus.NOT_FOUND, 'No purchase found');
            }

            createAccountData.reason = order.products.map(p => p.product.name);

            if (order.totalAmount !== Number(data.amount)) {
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'Wrong amount transaction found',
                );
            }

            const updatedOrderData = {
                status: 'Delivered',
                payStatus: 'Paid',
                payMethod: 'Payment Gateway',
                paidAmount: order.totalAmount,
                paymentDetails: [
                    {
                        method: 'SSLCommerz',
                        amount: order.totalAmount,
                        paidAt: new Date(),
                    },
                ],
            };

            const OrderUpdate = await Order.findByIdAndUpdate(
                order._id,
                updatedOrderData,
                { new: true },
            );
            if (!OrderUpdate) {
                console.log('Failed to update purchase: ', order.id);
                redirectUrl = `https://oditicareer.com/sslcommerz/${type}?status=FAILED&tran_id=${data.tran_id}`;
            }
        }

        await Account.create(createAccountData);

        return redirectUrl;
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                err?.message || 'Failed to verify payment request',
                err.stack,
            );
        } else {
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Failed to verify payment request',
            );
        }
    }
};

// notify payment
const notifyPaymentRequest = async (payload: {
    val_id: string;
    tran_id: string;
}) => {
    return {
        valID: payload?.val_id || '',
        orderID: payload?.tran_id || '',
    };
};

export const SSLCommerzServices = {
    createPaymentRequest,
    verifyPaymentRequest,
    notifyPaymentRequest,
};
