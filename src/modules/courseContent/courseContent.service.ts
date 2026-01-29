import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Course } from '../course/course.model';
import { ICourseContent } from './courseContent.interface';
import { CourseContent } from './courseContent.model';
import { Module } from '../module/module.model';
import QueryBuilder from '../../builder/QueryBuilder';
import generateID from '../../utils/generateID';
import { Question } from '../question/question.model';
import { Purchase } from '../purchase/purchase.model';
import { JwtPayload } from 'jsonwebtoken';
import { Student } from '../student/student.model';

const getAllCourseContentsFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        CourseContent.find({ isDeleted: false }),
        query,
    )
        .filter()
        .sort()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return {
        result,
        meta,
    };
};

const getAllCourseCurriculumFromDB = async (query: Record<string, unknown>) => {
    const modules = await Module.find({
        course: query.course,
        isDeleted: false,
    }).select('_id id name');
    const result = await Promise.all(
        modules.map(async module => {
            const contents = await CourseContent.find({
                module: module._id,
                status: 'Active',
                isDeleted: false,
            });
            return {
                ...module.toObject(),
                contents,
            };
        }),
    );

    return result;
};

const getPurchasedCourseCurriculumFromDB = async (
    id: string,
    userPayload: JwtPayload,
) => {
    const course = await Course.findOne({ id }).select('_id id name');
    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course found');
    }

    const student = await Student.findOne({
        id: userPayload.userID,
        isDeleted: false,
    }).select('_id');
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No student found');
    }

    const purchase = await Purchase.findOne({
        student: student._id,
        course: course._id,
        status: 'Active',
        expiredAt: { $gte: new Date() },
        isDeleted: false,
    });
    if (!purchase) {
        throw new AppError(httpStatus.NOT_FOUND, 'No purchase found');
    }

    const modules = await Module.find({
        course: course._id,
        isDeleted: false,
    }).select('_id id name');
    const result = await Promise.all(
        modules.map(async module => {
            const contents = await CourseContent.find({
                module: module._id,
                status: 'Active',
                isDeleted: false,
            });
            return {
                ...module.toObject(),
                contents,
            };
        }),
    );

    return { ...course.toObject(), contents: result };
};

const getPurchasedSingleCourseContentFromDB = async (
    id: string,
    userPayload: JwtPayload,
) => {
    let result = await CourseContent.findOne({ id }).populate(
        'module',
        '_id id name',
    );
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course content found');
    }
    if (result.type === 'Exam') {
        result = await CourseContent.findOne({ id })
            .populate('course', '_id id name')
            .populate('module', '_id id name')
            .populate(
                'content.exam.questions',
                '-answer -explaination -isDeleted -tags -createdAt -updatedAt -createdBy',
            );
    }
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course content found');
    }

    const student = await Student.findOne({
        id: userPayload.userID,
        isDeleted: false,
    }).select('_id');
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No student found');
    }

    const purchase = await Purchase.findOne({
        student: student._id,
        course: result.type === 'Exam' ? result.course._id : result.course,
        status: 'Active',
        expiredAt: { $gte: new Date() },
        isDeleted: false,
    }).select('_id id');
    if (!purchase) {
        throw new AppError(httpStatus.NOT_FOUND, 'No purchase found');
    }

    return result;
};

const getPurchasedExamWithAnswerFromDB = async (
    id: string,
    userPayload: JwtPayload,
) => {
    const result = await CourseContent.findOne({ id })
        .select('course content.exam')
        .populate(
            'content.exam.questions',
            '_id id question answer explaination options',
        );
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course content found');
    }

    const student = await Student.findOne({
        id: userPayload.userID,
        isDeleted: false,
    }).select('_id');
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No student found');
    }

    const purchase = await Purchase.findOne({
        student: student._id,
        course: result.course,
        status: 'Active',
        expiredAt: { $gte: new Date() },
        isDeleted: false,
    }).select('_id id');
    if (!purchase) {
        throw new AppError(httpStatus.NOT_FOUND, 'No purchase found');
    }

    return result.content.exam;
};

const updateCourseContentIntoDB = async (
    id: string,
    payload: { status: 'Active' | 'Inactive' },
) => {
    const courseContent = await CourseContent.findOne({
        id,
        isDeleted: false,
    }).select('_id');
    if (!courseContent) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course content found');
    }
    const result = await CourseContent.findByIdAndUpdate(
        courseContent._id,
        payload,
        { new: true },
    );
    return result;
};

const deleteCourseContentFromDB = async (id: string) => {
    const courseContent = await CourseContent.findOne({
        id,
        isDeleted: false,
    }).select('_id');
    if (!courseContent) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course content found');
    }
    const result = await CourseContent.findByIdAndUpdate(
        courseContent._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

const createLiveClassIntoDB = async (payload: ICourseContent) => {
    // check course
    const course = await Course.findOne({
        id: payload.course,
        isDeleted: false,
    }).select('_id');
    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course found');
    }

    // check module
    const module = await Module.findOne({
        id: payload.module,
        isDeleted: false,
    }).select('_id');
    if (!module) {
        throw new AppError(httpStatus.NOT_FOUND, 'No module found');
    }

    // create live class
    const createLiveClassData = {
        ...payload,
    };
    createLiveClassData.course = course._id;
    createLiveClassData.module = module._id;
    createLiveClassData.id = await generateID(CourseContent);
    if (createLiveClassData.content.liveClass?.startTime) {
        createLiveClassData.content.liveClass.startTime = new Date(
            new Date(
                createLiveClassData.content.liveClass?.startTime,
            ).getTime(),
        );
    }
    if (createLiveClassData.content.liveClass?.endTime) {
        createLiveClassData.content.liveClass.endTime = new Date(
            new Date(createLiveClassData.content.liveClass?.endTime).getTime(),
        );
    }
    if (!createLiveClassData.scheduledAt) {
        createLiveClassData.scheduledAt = new Date(new Date().getTime());
    } else {
        createLiveClassData.scheduledAt = new Date(
            new Date(createLiveClassData.scheduledAt).getTime(),
        );
    }

    const result = await CourseContent.create(createLiveClassData);
    return result;
};

const getAllLiveClassesFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        CourseContent.find({ type: 'Live Class', isDeleted: false })
            .populate('course')
            .populate('module'),
        query,
    )
        .filter()
        .sort()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return {
        result,
        meta,
    };
};

const getSingleLiveClassFromDB = async (id: string) => {
    const result = await CourseContent.findOne({ id, isDeleted: false })
        .populate('course')
        .populate('module');
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No live class found');
    }
    return result;
};

const updateLiveClassIntoDB = async (
    id: string,
    payload: Partial<ICourseContent>,
) => {
    const liveClass = await CourseContent.findOne({
        id,
        isDeleted: false,
    }).select('_id');
    if (!liveClass) {
        throw new AppError(httpStatus.NOT_FOUND, 'No live class found');
    }

    const updateLiveClassData = {
        ...payload,
    };
    if (updateLiveClassData?.content?.liveClass?.startTime) {
        updateLiveClassData.content.liveClass.startTime = new Date(
            new Date(
                updateLiveClassData.content.liveClass?.startTime,
            ).getTime(),
        );
    }
    if (updateLiveClassData?.content?.liveClass?.endTime) {
        updateLiveClassData.content.liveClass.endTime = new Date(
            new Date(updateLiveClassData.content.liveClass?.endTime).getTime(),
        );
    }
    if (updateLiveClassData?.scheduledAt) {
        updateLiveClassData.scheduledAt = new Date(
            new Date(updateLiveClassData.scheduledAt).getTime(),
        );
    }

    const result = await CourseContent.findByIdAndUpdate(
        liveClass._id,
        updateLiveClassData,
        { new: true },
    );
    return result;
};

const deleteLiveClassFromDB = async (id: string) => {
    const liveClass = await CourseContent.findOne({
        id,
        isDeleted: false,
    }).select('_id');
    if (!liveClass) {
        throw new AppError(httpStatus.NOT_FOUND, 'No live class found');
    }
    const result = await CourseContent.findByIdAndUpdate(
        liveClass._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

const createLectureIntoDB = async (payload: ICourseContent) => {
    // check course
    const course = await Course.findOne({
        id: payload.course,
        isDeleted: false,
    }).select('_id');
    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course found');
    }

    // check module
    const module = await Module.findOne({
        id: payload.module,
        isDeleted: false,
    }).select('_id');
    if (!module) {
        throw new AppError(httpStatus.NOT_FOUND, 'No module found');
    }

    // create lecture
    const createLectureData = {
        ...payload,
    };
    createLectureData.course = course._id;
    createLectureData.module = module._id;
    createLectureData.id = await generateID(CourseContent);
    if (!createLectureData.scheduledAt) {
        createLectureData.scheduledAt = new Date(new Date().getTime());
    } else {
        createLectureData.scheduledAt = new Date(
            new Date(createLectureData.scheduledAt).getTime(),
        );
    }

    const result = await CourseContent.create(createLectureData);
    return result;
};

const getAllLecturesFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        CourseContent.find({ type: 'Lecture', isDeleted: false })
            .populate('course')
            .populate('module'),
        query,
    )
        .filter()
        .sort()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return {
        result,
        meta,
    };
};

const getSingleLectureFromDB = async (id: string) => {
    const result = await CourseContent.findOne({ id, isDeleted: false })
        .populate('course')
        .populate('module');
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No lecture found');
    }
    return result;
};

const updateLectureIntoDB = async (
    id: string,
    payload: Partial<ICourseContent>,
) => {
    const lecture = await CourseContent.findOne({
        id,
        isDeleted: false,
    }).select('_id');
    if (!lecture) {
        throw new AppError(httpStatus.NOT_FOUND, 'No lecture found');
    }

    const updateLectureData = {
        ...payload,
    };
    if (updateLectureData?.scheduledAt) {
        updateLectureData.scheduledAt = new Date(
            new Date(updateLectureData.scheduledAt).getTime(),
        );
    }

    const result = await CourseContent.findByIdAndUpdate(
        lecture._id,
        updateLectureData,
        { new: true },
    );
    return result;
};

const deleteLectureFromDB = async (id: string) => {
    const lecture = await CourseContent.findOne({
        id,
        isDeleted: false,
    }).select('_id');
    if (!lecture) {
        throw new AppError(httpStatus.NOT_FOUND, 'No lecture found');
    }
    const result = await CourseContent.findByIdAndUpdate(
        lecture._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

const createNoteIntoDB = async (payload: ICourseContent) => {
    // check course
    const course = await Course.findOne({
        id: payload.course,
        isDeleted: false,
    }).select('_id');
    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course found');
    }

    // check module
    const module = await Module.findOne({
        id: payload.module,
        isDeleted: false,
    }).select('_id');
    if (!module) {
        throw new AppError(httpStatus.NOT_FOUND, 'No module found');
    }

    // create note
    const createNoteData = {
        ...payload,
    };
    createNoteData.course = course._id;
    createNoteData.module = module._id;
    createNoteData.id = await generateID(CourseContent);
    if (!createNoteData.scheduledAt) {
        createNoteData.scheduledAt = new Date(new Date().getTime());
    } else {
        createNoteData.scheduledAt = new Date(
            new Date(createNoteData.scheduledAt).getTime(),
        );
    }

    const result = await CourseContent.create(createNoteData);
    return result;
};

const getAllNotesFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        CourseContent.find({ type: 'Note', isDeleted: false })
            .populate('course')
            .populate('module'),
        query,
    )
        .filter()
        .sort()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return {
        result,
        meta,
    };
};

const getSingleNoteFromDB = async (id: string) => {
    const result = await CourseContent.findOne({ id, isDeleted: false })
        .populate('course')
        .populate('module');
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No note found');
    }
    return result;
};

const updateNoteIntoDB = async (
    id: string,
    payload: Partial<ICourseContent>,
) => {
    const note = await CourseContent.findOne({
        id,
        isDeleted: false,
    }).select('_id');
    if (!note) {
        throw new AppError(httpStatus.NOT_FOUND, 'No note found');
    }

    const updateNoteData = {
        ...payload,
    };
    if (updateNoteData?.scheduledAt) {
        updateNoteData.scheduledAt = new Date(
            new Date(updateNoteData.scheduledAt).getTime(),
        );
    }

    const result = await CourseContent.findByIdAndUpdate(
        note._id,
        updateNoteData,
        { new: true },
    );
    return result;
};

const deleteNoteFromDB = async (id: string) => {
    const note = await CourseContent.findOne({
        id,
        isDeleted: false,
    }).select('_id');
    if (!note) {
        throw new AppError(httpStatus.NOT_FOUND, 'No note found');
    }
    const result = await CourseContent.findByIdAndUpdate(
        note._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

const createExamIntoDB = async (payload: ICourseContent) => {
    // check course
    const course = await Course.findOne({
        id: payload.course,
        isDeleted: false,
    }).select('_id');
    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, 'No course found');
    }

    // check module
    const module = await Module.findOne({
        id: payload.module,
        isDeleted: false,
    }).select('_id');
    if (!module) {
        throw new AppError(httpStatus.NOT_FOUND, 'No module found');
    }

    // create exam
    const createExamData = {
        ...payload,
    };
    createExamData.course = course._id;
    createExamData.module = module._id;
    createExamData.id = await generateID(CourseContent);
    if (createExamData.content.exam?.validity) {
        createExamData.content.exam.validity = new Date(
            new Date(createExamData.content.exam?.validity).getTime(),
        );
    }
    if (!createExamData.scheduledAt) {
        createExamData.scheduledAt = new Date(new Date().getTime());
    } else {
        createExamData.scheduledAt = new Date(
            new Date(createExamData.scheduledAt).getTime(),
        );
    }

    const result = await CourseContent.create(createExamData);
    return result;
};

const getAllExamsFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        CourseContent.find({ type: 'Exam', isDeleted: false })
            .populate('course', '_id id name image')
            .populate('module', '_id id name'),
        query,
    )
        .filter()
        .sort()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return {
        result,
        meta,
    };
};

const getTodaysExamsFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        CourseContent.find({
            type: 'Exam',
            scheduledAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
            isDeleted: false,
        })
            .populate('course', '_id id name image')
            .populate('module', '_id id name'),
        query,
    )
        .filter()
        .sort()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return {
        result,
        meta,
    };
};

const getSingleExamFromDB = async (id: string) => {
    const result = await CourseContent.findOne({ id, isDeleted: false })
        .populate('course')
        .populate('module')
        .populate('content.exam.questions');
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No exam found');
    }
    return result;
};

const updateExamIntoDB = async (
    id: string,
    payload: Partial<ICourseContent>,
) => {
    const exam = await CourseContent.findOne({
        id,
        isDeleted: false,
    }).select('_id content.exam');
    if (!exam) {
        throw new AppError(httpStatus.NOT_FOUND, 'No exam found');
    }

    const updateExamData: Partial<ICourseContent> = {
        ...payload,
    };
    if (updateExamData?.content?.exam?.questions) {
        const questions = await Promise.all(
            updateExamData.content.exam.questions.map(async item => {
                // check question
                const question = await Question.findOne({
                    id: item,
                    isDeleted: false,
                }).select('_id');
                if (!question) {
                    throw new AppError(
                        httpStatus.NOT_FOUND,
                        'No question found',
                    );
                }
                return question._id;
            }),
        );
        updateExamData.content.exam.questions = questions;
    }
    if (exam.content.exam?.questions) {
        if (
            updateExamData?.content &&
            updateExamData.content?.exam &&
            !updateExamData.content.exam.questions
        ) {
            updateExamData.content.exam.questions = exam.content.exam.questions;
        }
    }
    if (updateExamData?.content?.exam?.validity) {
        updateExamData.content.exam.validity = new Date(
            new Date(updateExamData.content.exam?.validity).getTime(),
        );
    }
    if (updateExamData?.scheduledAt) {
        updateExamData.scheduledAt = new Date(
            new Date(updateExamData.scheduledAt).getTime(),
        );
    }

    const result = await CourseContent.findByIdAndUpdate(
        exam._id,
        updateExamData,
        { new: true },
    );
    return result;
};

const deleteExamFromDB = async (id: string) => {
    const exam = await CourseContent.findOne({
        id,
        isDeleted: false,
    }).select('_id');
    if (!exam) {
        throw new AppError(httpStatus.NOT_FOUND, 'No exam found');
    }
    const result = await CourseContent.findByIdAndUpdate(
        exam._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const CourseContentServices = {
    getAllCourseContentsFromDB,
    getAllCourseCurriculumFromDB,
    getPurchasedCourseCurriculumFromDB,
    getPurchasedSingleCourseContentFromDB,
    getPurchasedExamWithAnswerFromDB,
    updateCourseContentIntoDB,
    deleteCourseContentFromDB,
    createLiveClassIntoDB,
    getAllLiveClassesFromDB,
    getSingleLiveClassFromDB,
    updateLiveClassIntoDB,
    deleteLiveClassFromDB,
    createLectureIntoDB,
    getAllLecturesFromDB,
    getSingleLectureFromDB,
    updateLectureIntoDB,
    deleteLectureFromDB,
    createNoteIntoDB,
    getAllNotesFromDB,
    getSingleNoteFromDB,
    updateNoteIntoDB,
    deleteNoteFromDB,
    createExamIntoDB,
    getAllExamsFromDB,
    getTodaysExamsFromDB,
    getSingleExamFromDB,
    updateExamIntoDB,
    deleteExamFromDB,
};
