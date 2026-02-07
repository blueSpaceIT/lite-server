/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { Account } from '../account/account.model';
import { Order } from '../order/order.model';
import { Purchase } from '../purchase/purchase.model';
import {
    IPayStationInitiateResponse,
    IPayStationPaymentRequest,
    IPayStationTransactionStatus,
} from './paystation.interface';
import { generateInvoiceID } from '../../utils/generateInvoiceID';

const PAYSTATION_URL = 'https://api.paystation.com.bd';

const createPaymentRequest = async (payload: IPayStationPaymentRequest) => {
    const body = {
        merchantId: config.paystationMerchantId,
        password: config.paystationPassword,
        invoice_number: generateInvoiceID,
        currency: 'BDT',
        payment_amount: payload.totalAmount,
        cust_name: payload.name,
        cust_phone: payload.phone,
        cust_email: payload.email,
        cust_address: payload.address,
        callback_url: `${payload.callbackURL}/${payload.type}`,
    };

    const response = await fetch(`${PAYSTATION_URL}/initiate-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(body as any),
    });

    const data: IPayStationInitiateResponse = await response.json();

    if (data.status !== 'success') {
        throw new AppError(httpStatus.BAD_REQUEST, data.message);
    }

    return data;
};

const handleCallback = async (
    type: string,
    query: { status: string; invoice_number: string; trx_id?: string }
) => {
    const { status, invoice_number, trx_id } = query;

    // normalize status
    if (status?.toLowerCase() !== 'successful') {
        return `https://liteedu.com/payment/${type}?status=FAILED&invoice=${invoice_number}`;
    }

    const verify = await verifyTransaction(invoice_number);

    if (verify.trx_status !== 'success') {
        return `https://liteedu.com/payment/${type}?status=FAILED&invoice=${invoice_number}`;
    }

    // ---------- PURCHASE ----------
    if (type === 'purchase') {
        const purchase = await Purchase.findOne({ id: invoice_number });
        if (!purchase)
            throw new AppError(httpStatus.NOT_FOUND, 'Purchase not found');

        const amount = Number(verify.payment_amount);

        purchase.paymentDetails = purchase.paymentDetails || [];
        purchase.paymentDetails.push({
            method: 'PayStation',
            amount,
            trxID: verify.trx_id,
            paidAt: new Date(),
        });

        purchase.paidAmount += amount;

        purchase.payStatus =
            purchase.paidAmount >= purchase.totalAmount
                ? 'Paid'
                : purchase.paidAmount > 0
                    ? 'Partial'
                    : 'Pending';

        purchase.status =
            purchase.payStatus === 'Paid' ? 'Active' : 'Pending';

        await purchase.save();
    }

    // ---------- ORDER ----------
    if (type === 'order') {
        const order = await Order.findOne({ id: invoice_number });
        if (!order)
            throw new AppError(httpStatus.NOT_FOUND, 'Order not found');

        order.payStatus = 'Paid';
        order.status = 'Delivered';
        await order.save();
    }

    // ---------- ACCOUNT ----------
    await Account.create({
        type: 'Earning',
        method: 'PayStation',
        amount: Number(verify.payment_amount),
        reason: ['Payment Gateway'],
    });

    return `https://liteedu.com/payment/${type}?status=SUCCESS&trx_id=${trx_id}`;
};

const verifyTransaction = async (
    invoice_number: string
): Promise<IPayStationTransactionStatus> => {
    if (!config.paystationMerchantId) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'PayStation merchant ID is not configured'
        );
    }

    const headers = new Headers();
    headers.append('merchantId', config.paystationMerchantId);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const response = await fetch(`${PAYSTATION_URL}/transaction-status`, {
        method: 'POST',
        headers,
        body: new URLSearchParams({ invoice_number }).toString(),
    });

    const data = await response.json();

    if (data.status !== 'success') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Transaction not found');
    }

    return data.data;
};

export const PayStationServices = {
    createPaymentRequest,
    handleCallback,
    verifyTransaction,
};
