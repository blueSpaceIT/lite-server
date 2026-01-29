export interface ISSLCommerzPaymentRequest {
    totalAmount: number;
    invoiceID: string;
    name: string;
    phone: string;
    address: string;
    type: 'purchase' | 'order';
    callbackURL: string;
}

export interface ISSLCommerzPaymentResponse {
    status: 'SUCCESS' | 'FAILED';
    failedreason: string;
    sessionkey: string;
    GatewayPageURL: string;
}

export interface ISSLCommerzVerifyResponse {
    status: 'VALID' | 'VALIDATED' | 'INVALID_TRANSACTION';
    tran_id: string;
    val_id: string;
    amount: string;
    card_issuer: string;
}
