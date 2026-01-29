import httpStatus from 'http-status';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import AppError from '../errors/AppError';

const verifyToken = (token: string, secret: Secret): Promise<JwtPayload> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                reject(
                    new AppError(
                        httpStatus.UNAUTHORIZED,
                        'You are not authorized',
                    ),
                );
            } else {
                resolve(decoded as JwtPayload);
            }
        });
    });
};

export default verifyToken;