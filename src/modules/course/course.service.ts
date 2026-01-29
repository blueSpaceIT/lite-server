import httpStatus from 'http-status';
import generateID from '../../utils/generateID';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { ICourse } from './course.interface';
import { Course } from './course.model';
import { Admin } from '../admin/admin.model';
import { CourseCategory } from '../courseCategory/courseCategory.model';
import { Purchase } from '../purchase/purchase.model';

// create course
const createCourseIntoDB = async (payload: ICourse) => {
    // check course category
    const courseCategory = await CourseCategory.findOne({
        id: payload.category,
        isDeleted: false,
    }).select('_id');
    if (!courseCategory) {
        throw new AppError(httpStatus.NOT_FOUND, 'No category found');
    }

    // create course data
    const createCourseData = {
        ...payload,
    };
    createCourseData.id = await generateID(Course);
    createCourseData.category = courseCategory._id;
    if (createCourseData?.teachers) {
        const teachers = await Promise.all(
            createCourseData.teachers.map(async item => {
                const teacher = await Admin.findOne({ id: item }).select('_id');
                if (!teacher) {
                    throw new AppError(
                        httpStatus.NOT_FOUND,
                        'No teacher found',
                    );
                }

                return teacher._id;
            }),
        );

        createCourseData.teachers = teachers;
    }

    const result = await Course.create(createCourseData);
    return result;
};

// get all courses
const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        Course.find({ isDeleted: false })
            .populate('category', '_id id name')
            .populate('teachers', '_id id name phone designation image'),
        query,
    )
        .search(['name', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const courses = await fetchQuery.modelQuery;
    const result = await Promise.all(
        courses.map(async course => {
            const enrolledStudents = await Purchase.countDocuments({
                course: course._id,
                status: 'Active',
                isDeleted: false,
            });
            return { ...course.toObject(), enrolledStudents };
        }),
    );
    const meta = await fetchQuery.countTotal();
    return { result, meta };
};

// get all free courses
const getAllFreeCoursesFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        Course.find({ price: 0, isDeleted: false })
            .populate('category', '_id id name')
            .populate('teachers', '_id id name phone designation image'),
        query,
    )
        .search(['name', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const courses = await fetchQuery.modelQuery;
    const result = await Promise.all(
        courses.map(async course => {
            const enrolledStudents = await Purchase.countDocuments({
                course: course._id,
                status: 'Active',
                isDeleted: false,
            });
            return { ...course.toObject(), enrolledStudents };
        }),
    );
    const meta = await fetchQuery.countTotal();
    return { result, meta };
};

// get single course
const getSingleCourseFromDB = async (id: string) => {
    const result = await Course.findOne({ id, isDeleted: false })
        .populate('category')
        .populate('teachers');
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course found');
    }
    return result;
};

// update course
const updateCourseIntoDB = async (id: string, payload: Partial<ICourse>) => {
    const course = await Course.findOne({
        id,
        isDeleted: false,
    });
    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course found');
    }

    if (payload?.name && payload.name === '') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Name cannot be empty');
    }

    if (payload?.image && payload.image === '') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Image cannot be empty');
    }

    const updatedCourseData = {
        ...payload,
    };
    if (payload?.category) {
        // check course category
        const courseCategory = await CourseCategory.findOne({
            id: payload.category,
            isDeleted: false,
        }).select('_id');
        if (!courseCategory) {
            throw new AppError(httpStatus.NOT_FOUND, 'No category found');
        }
        updatedCourseData.category = courseCategory._id;
    }

    if (updatedCourseData?.teachers) {
        const teachers = await Promise.all(
            updatedCourseData.teachers.map(async item => {
                const teacher = await Admin.findOne({ id: item }).select('_id');
                if (!teacher) {
                    throw new AppError(
                        httpStatus.NOT_FOUND,
                        'No teacher found',
                    );
                }

                return teacher._id;
            }),
        );

        updatedCourseData.teachers = teachers;
    }

    const result = await Course.findByIdAndUpdate(
        course._id,
        updatedCourseData,
        { new: true },
    );
    return result;
};

// update course details
const updateCourseDetailsIntoDB = async (
    id: string,
    payload: Partial<ICourse>,
) => {
    const course = await Course.findOne({
        id,
        isDeleted: false,
    });
    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course found');
    }

    const updatedCourseDetailsData = {
        ...payload,
    };

    const result = await Course.findByIdAndUpdate(
        course._id,
        updatedCourseDetailsData,
        { new: true },
    );
    return result;
};

// delete course
const deleteCourseFromDB = async (id: string) => {
    const course = await Course.findOne({
        id,
        isDeleted: false,
    });
    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course found');
    }

    const result = await Course.findByIdAndUpdate(
        course._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getAllFreeCoursesFromDB,
    getSingleCourseFromDB,
    updateCourseIntoDB,
    updateCourseDetailsIntoDB,
    deleteCourseFromDB,
};
