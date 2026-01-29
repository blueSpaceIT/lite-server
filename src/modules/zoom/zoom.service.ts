import config from '../../config';
import { KJUR } from 'jsrsasign';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createZoomSignature = async (payload: {
    meetingNumber: string;
    expirationSeconds?: number;
}) => {
    const iat = Math.floor(Date.now() / 1000);
    const exp = payload?.expirationSeconds
        ? iat + payload.expirationSeconds
        : iat + 60 * 60 * 2;
    const oHeader = { alg: 'HS256', typ: 'JWT' };

    const oPayload = {
        appKey: config.zoomClientID,
        sdkKey: config.zoomClientID,
        mn: payload.meetingNumber,
        role: 0,
        iat,
        exp,
        tokenExp: exp,
        video_webrtc_mode: 1,
    };

    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);

    try {
        const signature = KJUR.jws.JWS.sign(
            'HS256',
            sHeader,
            sPayload,
            config.zoomClientSecret,
        );
        return { signature };
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'Failed to generate signature',
                err.stack,
            );
        }
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Failed to generate signature',
        );
    }
};

export const ZoomServices = {
    createZoomSignature,
};
