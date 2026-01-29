import httpStatus from 'http-status';
import {
    ICQAnswer,
    ICreateExamAttempt,
    IExamAttempt,
} from './examAttempt.interface';
import { JwtPayload } from 'jsonwebtoken';
import { CourseContent } from '../courseContent/courseContent.model';
import AppError from '../../errors/AppError';
import { Student } from '../student/student.model';
import { Question } from '../question/question.model';
import { ExamAttempt } from './examAttempt.model';

// create mcq exam attempt
const createMCQExamAttemptIntoDB = async (
    payload: ICreateExamAttempt,
    userPayload: JwtPayload,
) => {
    // check exam
    const exam = await CourseContent.findOne({
        id: payload.exam,
        isDeleted: false,
    }).select('_id course content.exam');
    if (!exam) {
        throw new AppError(httpStatus.NOT_FOUND, 'No exam found');
    }

    // check student
    const student = await Student.findOne({
        id: userPayload.userID,
        isDeleted: false,
    }).select('_id');
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No student found');
    }

    // check prev attempt
    const prevAttempt = await ExamAttempt.findOne({
        student: student._id,
        exam: exam._id,
    }).select('_id');
    if (prevAttempt) {
        throw new AppError(httpStatus.CONFLICT, 'Already exist');
    }

    const questionsIDs = payload.answers.map(item => item.question);
    const questions = await Question.find({
        _id: { $in: questionsIDs },
    }).select('_id question answer');

    const positiveMark = exam.content?.exam?.positiveMarks ?? 1;
    const negativeMark = exam.content?.exam?.negativeMarks ?? 0;
    const passingMarks = exam.content?.exam?.passingMarks ?? 0;
    const totalMarks = exam.content?.exam?.totalMarks ?? 0;
    const validTime = exam.content?.exam?.validity;
    let obtainedMarks = 0;
    let right = 0;
    let wrong = 0;

    for (const ans of payload.answers) {
        const found = questions.find(
            q => q._id.toString() === ans.question.toString(),
        );
        if (!found) continue;

        const isCorrect = found.answer === ans.answer;

        const marks = isCorrect ? positiveMark : -negativeMark;
        ans.mark = isCorrect ? positiveMark : -negativeMark;
        obtainedMarks += marks;

        if (isCorrect) {
            right++;
        } else {
            wrong++;
        }
    }

    const isPassed = obtainedMarks >= passingMarks;

    // create attempt data
    const createAttemptData: Partial<IExamAttempt> = {
        ...payload,
    };
    createAttemptData.course = exam.course;
    createAttemptData.exam = exam._id;
    createAttemptData.student = student._id;
    createAttemptData.right = right;
    createAttemptData.wrong = wrong;
    createAttemptData.totalMarks = totalMarks;
    createAttemptData.obtainedMarks = obtainedMarks;
    createAttemptData.isPassed = isPassed;

    createAttemptData.startTime = new Date(
        new Date(payload.startTime).getTime(),
    );
    createAttemptData.endTime = new Date(new Date(payload.endTime).getTime());
    createAttemptData.submitTime = new Date(
        new Date(payload.submitTime).getTime(),
    );

    const isOnTimeSubmit =
        new Date(payload.submitTime).getTime() -
        new Date(payload.endTime).getTime();

    const isVaidTimeSubmit =
        new Date(validTime as Date).getTime() -
        new Date(payload.startTime).getTime();

    if (isOnTimeSubmit < 30 && isVaidTimeSubmit > 0) {
        createAttemptData.isLive = true;
    } else {
        createAttemptData.isLive = false;
    }
    createAttemptData.isChecked = true;

    const result = await ExamAttempt.create(createAttemptData);
    return result;
};

// create cq exam attempt
const createCQExamAttemptIntoDB = async (
    payload: ICreateExamAttempt,
    userPayload: JwtPayload,
) => {
    // check exam
    const exam = await CourseContent.findOne({
        id: payload.exam,
        isDeleted: false,
    }).select('_id course content.exam');
    if (!exam) {
        throw new AppError(httpStatus.NOT_FOUND, 'No exam found');
    }

    // check student
    const student = await Student.findOne({
        id: userPayload.userID,
        isDeleted: false,
    }).select('_id');
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No student found');
    }

    // check prev attempt
    const prevAttempt = await ExamAttempt.findOne({
        student: student._id,
        exam: exam._id,
    }).select('_id');
    if (prevAttempt) {
        throw new AppError(httpStatus.CONFLICT, 'Already exist');
    }

    const totalMarks = exam.content?.exam?.totalMarks ?? 0;
    const validTime = exam.content?.exam?.validity;

    // create attempt data
    const createAttemptData: Partial<IExamAttempt> = {
        ...payload,
    };
    createAttemptData.course = exam.course;
    createAttemptData.exam = exam._id;
    createAttemptData.student = student._id;
    createAttemptData.totalMarks = totalMarks;

    createAttemptData.startTime = new Date(
        new Date(payload.startTime).getTime(),
    );
    createAttemptData.endTime = new Date(new Date(payload.endTime).getTime());
    createAttemptData.submitTime = new Date(
        new Date(payload.submitTime).getTime(),
    );

    const isOnTimeSubmit =
        new Date(payload.submitTime).getTime() -
        new Date(payload.endTime).getTime();

    const isVaidTimeSubmit =
        new Date(validTime as Date).getTime() -
        new Date(payload.startTime).getTime();

    if (isOnTimeSubmit < 30 && isVaidTimeSubmit > 0) {
        createAttemptData.isLive = true;
    } else {
        createAttemptData.isLive = false;
    }

    const result = await ExamAttempt.create(createAttemptData);
    return result;
};

// get exam attempts
const getExamAttemptsFromDB = async (id: string) => {
    // check exam
    const exam = await CourseContent.findOne({
        id,
        'content.exam.result': true,
        isDeleted: false,
    }).select('_id course content.exam');
    if (!exam) {
        throw new AppError(httpStatus.NOT_FOUND, 'No exam found');
    }

    const result = await ExamAttempt.find({
        exam: exam._id,
        isLive: true,
    })
        .sort('-obtainedMarks')
        .select('-course -exam')
        .populate('student', '_id id name');
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No attempt found');
    }
    return result;
};

// get exam attempts on admin
const getExamAttemptsOnAdminFromDB = async (id: string) => {
    // check exam
    const exam = await CourseContent.findOne({
        id,
        isDeleted: false,
    }).select('_id course content.exam');
    if (!exam) {
        throw new AppError(httpStatus.NOT_FOUND, 'No exam found');
    }

    const result = await ExamAttempt.find({
        exam: exam._id,
        isLive: true,
    })
        .sort('-obtainedMarks')
        .select('-course -exam')
        .populate('student', '_id id name');
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No attempt found');
    }
    return result;
};

// get exam attempt
const getExamAttemptFromDB = async (userID: string, examID: string) => {
    // check exam
    const exam = await CourseContent.findOne({
        id: examID,
        isDeleted: false,
    }).select('_id course content.exam');
    if (!exam) {
        throw new AppError(httpStatus.NOT_FOUND, 'No exam found');
    }

    // check student
    const student = await Student.findOne({
        id: userID,
        isDeleted: false,
    }).select('_id');
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No student found');
    }

    const result = await ExamAttempt.findOne({
        student: student._id,
        exam: exam._id,
    })
        .select('-course -exam')
        .populate('student', '_id id name')
        .populate('answers.question', '_id id question');
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No attempt found');
    }
    return result;
};

// update cq mark
const updateCQMarkIntoDB = async (
    userID: string,
    examID: string,
    payload: ICQAnswer[],
) => {
    // check exam
    const exam = await CourseContent.findOne({
        id: examID,
        isDeleted: false,
    }).select('_id content.exam');
    if (!exam) {
        throw new AppError(httpStatus.NOT_FOUND, 'No exam found');
    }

    // check student
    const student = await Student.findOne({
        id: userID,
        isDeleted: false,
    }).select('_id');
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No student found');
    }

    // check exam attempt
    const examAttempt = await ExamAttempt.findOne({
        student: student._id,
        exam: exam._id,
    }).select('_id answers obtainedMarks isPassed');
    if (!examAttempt) {
        throw new AppError(httpStatus.NOT_FOUND, 'No attempt found');
    }

    const passingMarks = exam.content?.exam?.passingMarks ?? 0;
    examAttempt.obtainedMarks = payload.reduce(
        (acc, curr) => acc + (curr.mark || 0),
        0,
    );
    examAttempt.isPassed = examAttempt.obtainedMarks >= passingMarks;

    for (const ans of payload) {
        const existingAnswer = examAttempt.answers?.find(
            a => a.question.toString() === ans.question.toString(),
        );
        if (existingAnswer) {
            existingAnswer.mark = ans.mark;
        }
    }
    examAttempt.isChecked = true;

    await examAttempt.save();

    const result = examAttempt;
    return result;
};

export const ExamAttemptServices = {
    createMCQExamAttemptIntoDB,
    createCQExamAttemptIntoDB,
    getExamAttemptsFromDB,
    getExamAttemptsOnAdminFromDB,
    getExamAttemptFromDB,
    updateCQMarkIntoDB,
};
