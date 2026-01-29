import dotenv from 'dotenv';
import path from 'path';

// .env connection
dotenv.config({ path: path.join((process.cwd(), '.env')) });

// env variables
export default {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    databaseUrl:
        process.env.NODE_ENV === 'production'
            ? process.env.DB_URL
            : process.env.LOCAL_DB_URL,
    companyName: process.env.COMPANY_NAME,
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    accessTokenExp: process.env.ACCESS_TOKEN_EXP,
    refreshTokenExp: process.env.REFRESH_TOKEN_EXP,
    bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
    superAdminPassword: process.env.SUPER_ADMIN_PASSWORD,
    superAdminLimit: process.env.SUPER_ADMIN_LIMIT,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    zoomAccountID: process.env.ZOOM_ACCOUNT_ID,
    zoomClientID: process.env.ZOOM_CLIENT_ID,
    zoomClientSecret: process.env.ZOOM_CLIENT_SECRET,
    zoomSecretToken: process.env.ZOOM_SECRET_TOKEN,
    zoomBaseUrl: process.env.ZOOM_BASE_URL,
    smsApiKey: process.env.SMS_API_KEY,
    smsSenderID: process.env.SMS_SENDER_ID,
    paystationMerchantId: process.env.PAYSTATION_MERCHANT_ID,
    paystationPassword: process.env.PAYSTATION_PASSWORD,
    sslcommerzStoreID: process.env.SSLCOMMERZ_STORE_ID,
    sslcommerzStorePass: process.env.SSLCOMMERZ_STORE_PASS,
    frontendUrl: process.env.FRONTEND_BASE_URL,
    panelUrl: process.env.PANEL_BASE_URL,
};
