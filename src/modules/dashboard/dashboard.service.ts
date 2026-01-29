import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { JwtPayload } from 'jsonwebtoken';
import { Student } from '../student/student.model';
import { Purchase } from '../purchase/purchase.model';

// get dashboard widget counting
const getDashboardWidgetCountingFromDB = async (userPayload: JwtPayload) => {
    const student = await Student.findOne({
        id: userPayload.userID,
        isDeleted: false,
    });
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No student found');
    }

    const courses = await Purchase.find({
        student: student._id,
        status: 'Active',
        expiredAt: { $gte: new Date() },
        isDeleted: false,
    }).countDocuments();

    return { courses, exams: 0, orders: 0, ebooks: 0 };
};

export const DashboardServices = {
    getDashboardWidgetCountingFromDB,
};
