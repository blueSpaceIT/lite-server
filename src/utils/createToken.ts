import httpStatus from 'http-status';
import jwt, { Secret } from 'jsonwebtoken';
import AppError from '../errors/AppError';

interface TokenPayload {
    userID: string;
    role: string;
}

const createToken = (
    payload: TokenPayload,
    secret: Secret,
    expiresIn: number,
): Promise<string> => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, { expiresIn }, function (err, token) {
            if (err) {
                reject(
                    new AppError(
                        httpStatus.INTERNAL_SERVER_ERROR,
                        'Something went wrong',
                    ),
                );
            } else {
                resolve(token as string);
            }
        });
    });
};

export default createToken;
