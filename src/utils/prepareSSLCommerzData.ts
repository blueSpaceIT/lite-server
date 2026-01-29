import config from '../config';
import { ISSLCommerzPaymentRequest } from '../modules/sslcommerz/sslcommerz.interface';

const prepareSSLCommerzData = (payload: ISSLCommerzPaymentRequest) => {
    return {
        store_id: config.sslcommerzStoreID as string,
        store_passwd: config.sslcommerzStorePass as string,
        total_amount: String(payload.totalAmount),
        currency: 'BDT',
        tran_id: payload.invoiceID,
        success_url: `https://api.oditicareer.com/api/v1/sslcommerz/verify-payment/${payload.type}`,
        fail_url: `https://api.oditicareer.com/api/v1/sslcommerz/verify-payment/${payload.type}`,
        cancel_url: `https://api.oditicareer.com/api/v1/sslcommerz/verify-payment/${payload.type}`,
        ipn_url: 'https://api.oditicareer.com/api/v1/sslcommerz/notify',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: payload.name,
        cus_email: 'customer@example.com',
        cus_add1: payload.address || 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: payload.phone,
        cus_fax: '01711111111',
        ship_name: payload.name,
        ship_add1: payload.address || 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: String(1000),
        ship_country: 'Bangladesh',
    };
};

export default prepareSSLCommerzData;
