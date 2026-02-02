export interface IPayStationPaymentRequest {
    totalAmount: number;
    invoiceID: string;
    name: string;
    phone: string;
    email?: string;
    address: string;
    type: 'purchase' | 'order';
    callbackURL: string;
}

export interface IPayStationInitiateResponse {
    status_code: string;
    status: 'success' | 'failed';
    message: string;
    payment_url?: string;
    invoice_number?: string;
}

export interface IPayStationTransactionStatus {
    trx_status: 'processing' | 'success' | 'failed' | 'refund';
    trx_id?: string;
    payment_amount: string;
    payment_method?: string;
}
