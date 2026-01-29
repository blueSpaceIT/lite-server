import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import config from '../../config';
import { AuthServices } from './auth.service';
// signin controller
const signin = catchAsync(async (req, res) => {
    const { userType } = req.params;
    const result = await AuthServices.signinFromDB(
        userType as 'admin' | 'student',
        req,
    );
    const { refreshToken, accessToken, user } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: config.nodeEnv === 'production',
        httpOnly: true,
    });
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'User has been signed in successfully',
        data: { token: accessToken, user },
    });
});

// get me controller
const getMe = catchAsync(async (req, res) => {
    const { userType } = req.params;
    const result = await AuthServices.getMeFromDB(
        userType as 'admin' | 'student',
        req.user,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'User has been retrieved successfully',
        data: result,
    });
});

// get new access token controller
const getNewAccessToken = catchAsync(async (req, res) => {
    const { userType } = req.params;
    const { refreshToken } = req.cookies;
    const result = await AuthServices.getNewAccessTokenByRefreshToken(
        userType as 'admin' | 'student',
        refreshToken,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Access token has been generated successfully',
        data: result,
    });
});

// forget password controller
const forgetPassword = catchAsync(async (req, res) => {
    const { userType } = req.params;
    const result = await AuthServices.forgetPasswordLinkGenerate(
        userType as 'admin' | 'student',
        req.body,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Reset link has been generated successfully',
        data: config.nodeEnv === 'development' ? result : null,
    });
});

// reset password controller
const resetPassword = catchAsync(async (req, res) => {
    const { userType } = req.params;
    const result = await AuthServices.resetPasswordIntoDB(
        userType as 'admin' | 'student',
        req.user,
        req.body,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Password has been reset successfully',
        data: result,
    });
});

export const AuthControllers = {
    signin,
    getMe,
    getNewAccessToken,
    forgetPassword,
    resetPassword,
};
