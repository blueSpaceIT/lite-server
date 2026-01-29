import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import createToken from '../../utils/createToken';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';
import verifyToken from '../../utils/verifyToken';
import passwordHash from '../../utils/passwordHash';
import { Admin } from '../admin/admin.model';
import { Student } from '../student/student.model';
import passwordMatch from '../../utils/passwordMatch';
import { Request } from 'express';
import { StudentAuth } from './auth.model';
import sendSMS from '../../utils/sendSMS';

// signin
const signinFromDB = async (userType: 'admin' | 'student', req: Request) => {
    const headers = req.headers;
    const socket = req.socket;
    const useragent = req.useragent;
    const payload = req.body;

    let user = null;
    if (userType === 'admin') {
        user = await Admin.findOne({ phone: payload.phone }).select(
            '+password',
        );
    } else {
        user = await Student.findOne({ phone: payload.phone }).select(
            '+password',
        );
    }
    if (!user) {
        throw new AppError(httpStatus.FORBIDDEN, 'Phone or Password is wrong');
    }

    if (user.isDeleted === true) {
        throw new AppError(httpStatus.FORBIDDEN, 'Sorry, It is deleted user');
    }

    if (user.status === 'Inactive') {
        throw new AppError(httpStatus.FORBIDDEN, 'Sorry, It is blocked user');
    }

    const isPasswordMatched = await passwordMatch(
        payload.password,
        user.password,
    );
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, 'Phone or Password is wrong');
    }

    const jwtPayload = {
        userID: user.id,
        role: user.role,
    };

    const accessToken = await createToken(
        jwtPayload,
        config.accessSecret as string,
        Number(config.accessTokenExp),
    );

    const refreshToken = await createToken(
        jwtPayload,
        config.refreshSecret as string,
        Number(config.refreshTokenExp),
    );

    let userData = null;
    if (userType === 'admin') {
        userData = await Admin.findById(user._id).populate('branch');
    } else {
        userData = await Student.findById(user._id);
    }

    if (userType === 'student') {
        const ipAddress =
            headers['x-forwarded-for'] || socket?.remoteAddress || 'Unknown';
        const deviceType = useragent?.isMobile
            ? 'Mobile'
            : useragent?.isTablet
              ? 'Tablet'
              : useragent?.isDesktop
                ? 'Desktop'
                : 'Unknown';
        const deviceName = String(useragent?.os) + String(useragent?.platform);

        await StudentAuth.findOneAndUpdate(
            { student: user._id },
            {
                $set: { phone: user.phone, ipAddress, deviceType, deviceName },
                $setOnInsert: {
                    student: user._id,
                },
            },
            { upsert: true, new: true },
        );
    }

    return {
        accessToken,
        refreshToken,
        user: userData,
    };
};
// get me
const getMeFromDB = async (
    userType: 'admin' | 'student',
    payload: JwtPayload,
) => {
    let result = null;
    if (userType === 'admin') {
        result = await Admin.findOne({
            id: payload.userID,
            status: 'Active',
            isDeleted: false,
        }).populate('branch');
    } else {
        result = await Student.findOne({
            id: payload.userID,
            status: 'Active',
            isDeleted: false,
        });
    }
    if (!result) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are unauthorized');
    }
    return result;
};

// get new access token by refresh token
const getNewAccessTokenByRefreshToken = async (
    userType: 'admin' | 'student',
    token: string,
) => {
    const decoded = await verifyToken(token, config.refreshSecret as string);
    let user = null;
    if (userType === 'admin') {
        user = await Admin.findOne({
            id: (decoded as JwtPayload).userID,
            status: 'Active',
            isDeleted: false,
        });
    } else {
        user = await Student.findOne({
            id: (decoded as JwtPayload).userID,
            status: 'Active',
            isDeleted: false,
        });
    }
    if (!user) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            'Sorry, Something is suspecious',
        );
    }

    const jwtPayload = {
        userID: user.id,
        role: user.role,
    };

    const accessToken = await createToken(
        jwtPayload,
        config.accessSecret as string,
        Number(config.accessTokenExp),
    );

    return { accessToken };
};

// forget password reset link only
const forgetPasswordLinkGenerate = async (
    userType: 'admin' | 'student',
    payload: { phone: string },
) => {
    let user = null;
    if (userType === 'admin') {
        user = await Admin.isAdminExistByPhone(payload.phone);
    } else {
        user = await Student.isStudentExistByPhone(payload.phone);
    }
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'No user found');
    }

    if (user.isDeleted === true) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            'Sorry, Something is suspecious',
        );
    }

    if (user.status === 'Inactive') {
        throw new AppError(
            httpStatus.FORBIDDEN,
            'Sorry, Something is suspecious',
        );
    }

    const jwtPayload = {
        userID: user.id,
        role: user.role,
    };

    // create access token for reset password
    const accessToken = await createToken(
        jwtPayload,
        config.accessSecret as string,
        10 * 60,
    );

    let resetLink = null;
    if (userType === 'admin') {
        resetLink = `${config.panelUrl}/auth/reset-password?token=${accessToken}`;
    } else {
        resetLink = `${config.frontendUrl}/auth/reset-password?token=${accessToken}`;
    }
    await sendSMS(user.phone, `{Oditi Reset Password Link}, ${resetLink}`);
    return resetLink;
};

// reset password reset link only
const resetPasswordIntoDB = async (
    userType: 'admin' | 'student',
    userData: JwtPayload,
    payload: { password: string },
) => {
    let user = null;
    if (userType === 'admin') {
        user = await Admin.findOne({
            id: userData.userID,
            status: 'Active',
            isDeleted: false,
        });
    } else {
        user = await Student.findOne({
            id: userData.userID,
            status: 'Active',
            isDeleted: false,
        });
    }
    if (!user) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            'Sorry, Something is suspecious',
        );
    }

    const password = await passwordHash(payload.password as string);

    let result = null;
    if (userType === 'admin') {
        result = await Admin.findByIdAndUpdate(
            user._id,
            { password },
            { new: true },
        );
    } else {
        result = await Student.findByIdAndUpdate(
            user._id,
            { password },
            { new: true },
        );
    }

    return result;
};

export const AuthServices = {
    signinFromDB,
    getMeFromDB,
    getNewAccessTokenByRefreshToken,
    forgetPasswordLinkGenerate,
    resetPasswordIntoDB,
};
