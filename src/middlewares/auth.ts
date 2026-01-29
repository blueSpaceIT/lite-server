import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { NextFunction, Request, Response } from 'express';
import AppError from '../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TAdminRole } from '../modules/admin/admin.interface';
import { Student } from '../modules/student/student.model';
import { StudentAuth } from '../modules/auth/auth.model';

const auth = (...requiredRole: (TAdminRole | 'student')[]) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const bearerToken = req.headers.authorization;

            // take only token from 'Bearer token'
            const accessToken = bearerToken?.split(' ')[1];
            if (!accessToken) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'You are not authorized',
                );
            }

            // token verify
            try {
                const decoded = jwt.verify(
                    accessToken,
                    config.accessSecret as string,
                ) as JwtPayload;

                console.log(decoded);

                const decodedRole = (decoded as JwtPayload).role;

                if (requiredRole && !requiredRole.includes(decodedRole)) {
                    throw new AppError(
                        httpStatus.UNAUTHORIZED,
                        'You are not authorized',
                    );
                }

                if (
                    requiredRole &&
                    requiredRole.includes(decodedRole) &&
                    decodedRole === 'student'
                ) {
                    const student = await Student.findOne({
                        id: (decoded as JwtPayload).userID,
                    }).select('_id');
                    if (!student) {
                        throw new AppError(
                            httpStatus.UNAUTHORIZED,
                            'You are not authorized',
                        );
                    }

                    const authData = await StudentAuth.findOne({
                        student: student._id,
                    }).select('ipAddress deviceType deviceName');
                    if (!authData) {
                        throw new AppError(
                            httpStatus.UNAUTHORIZED,
                            'You are not authorized',
                        );
                    }

                    // const headers = req.headers;
                    // const socket = req.socket;
                    const useragent = req.useragent;
                    // const ipAddress =
                    //     headers['x-forwarded-for'] ||
                    //     socket?.remoteAddress ||
                    //     'Unknown';
                    const deviceType = useragent?.isMobile
                        ? 'Mobile'
                        : useragent?.isTablet
                          ? 'Tablet'
                          : useragent?.isDesktop
                            ? 'Desktop'
                            : 'Unknown';
                    const deviceName =
                        String(useragent?.os) + String(useragent?.platform);
                    if (
                        deviceType !== authData.deviceType ||
                        deviceName !== authData.deviceName
                    ) {
                        throw new AppError(
                            httpStatus.LOCKED,
                            'You are not authorized',
                        );
                    }
                }

                // set user in request
                req.user = decoded as JwtPayload;
                next();
            } catch {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'You are not authorized',
                );
            }
        },
    );
};

export default auth;
