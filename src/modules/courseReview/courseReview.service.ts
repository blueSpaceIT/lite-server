import httpStatus from 'http-status';
import generateID from '../../utils/generateID';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { ICourseReview } from './courseReview.interface';
import { CourseReview } from './courseReview.model';
import { Course } from '../course/course.model';
import { Student } from '../student/student.model';
import { Purchase } from '../purchase/purchase.model';
import { JwtPayload } from 'jsonwebtoken';

// create course review
const createCourseReviewIntoDB = async (payload: ICourseReview) => {
    // check course
    const course = await Course.findOne({
        id: payload.course,
        isDeleted: false,
    }).select('_id');
    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course found');
    }

    // check student
    const student = await Student.findOne({
        id: payload.student,
        isDeleted: false,
    }).select('_id');
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No student found');
    }

    // check purchase
    const purchase = await Purchase.findOne({
        student: student._id,
        course: course._id,
        status: 'Active',
        expiredAt: { $gte: new Date() },
        isDeleted: false,
    }).select('_id id');
    if (!purchase) {
        throw new AppError(httpStatus.NOT_FOUND, 'No purchase found');
    }

    if (payload.rating < 1 || payload.rating > 5) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Rating must be between 1 and 5',
        );
    }

    // check prev review
    const prevReview = await CourseReview.findOne({
        course: course._id,
        student: student._id,
    }).select('_id');
    if (prevReview) {
        throw new AppError(httpStatus.CONFLICT, 'Already reviewed');
    }

    // create course review data
    const createCourseReviewData = {
        ...payload,
    };
    createCourseReviewData.id = await generateID(CourseReview);
    createCourseReviewData.course = course._id;
    createCourseReviewData.student = student._id;

    const result = await CourseReview.create(createCourseReviewData);
    return result;
};

// get all course reviews
const getAllCourseReviewsFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        CourseReview.find({ isDeleted: false })
            .populate('course', '_id id name')
            .populate('student', '_id id name phone image'),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return { result, meta };
};

// get single course review
const getSingleCourseReviewFromDB = async (id: string) => {
    const result = await CourseReview.findOne({ id, isDeleted: false })
        .populate('course', '_id id name')
        .populate('student', '_id id name phone image');
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course review found');
    }
    return result;
};

// get my course review
const getMyCourseReviewFromDB = async (
    userPayload: JwtPayload,
    courseID: string,
) => {
    // check course
    const course = await Course.findOne({
        id: courseID,
    }).select('_id');
    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course found');
    }

    // check student
    const student = await Student.findOne({
        id: userPayload.userID,
        isDeleted: false,
    }).select('_id');
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No student found');
    }

    const result = await CourseReview.findOne({
        course: course._id,
        student: student._id,
    })
        .populate('course', '_id id name')
        .populate('student', '_id id name phone image');
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course review found');
    }
    return result;
};

// update course review
const updateCourseReviewIntoDB = async (
    id: string,
    payload: Partial<ICourseReview>,
) => {
    const courseReview = await CourseReview.findOne({ id, isDeleted: false });
    if (!courseReview) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course review found');
    }

    if (payload?.rating && (payload.rating < 1 || payload.rating > 5)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Rating must be between 1 and 5',
        );
    }

    const updatedCourseReviewData = {
        ...payload,
    };

    const result = await CourseReview.findByIdAndUpdate(
        courseReview._id,
        updatedCourseReviewData,
        { new: true },
    );
    return result;
};

// delete course review
const deleteCourseReviewFromDB = async (id: string) => {
    const courseReview = await CourseReview.findOne({
        id,
        isDeleted: false,
    });
    if (!courseReview) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course review found');
    }

    const result = await CourseReview.findByIdAndUpdate(
        courseReview._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const CourseReviewServices = {
    createCourseReviewIntoDB,
    getAllCourseReviewsFromDB,
    getSingleCourseReviewFromDB,
    getMyCourseReviewFromDB,
    updateCourseReviewIntoDB,
    deleteCourseReviewFromDB,
};
