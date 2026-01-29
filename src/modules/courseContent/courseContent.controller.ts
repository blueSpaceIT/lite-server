import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { CourseContentServices } from './courseContent.service';

const getAllCourseContents = catchAsync(async (req, res) => {
    const result = await CourseContentServices.getAllCourseContentsFromDB(
        req.query,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Course contents have been retrieved successfully',
        data: result,
    });
});

const getAllCourseCurriculum = catchAsync(async (req, res) => {
    const result = await CourseContentServices.getAllCourseCurriculumFromDB(
        req.query,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Course curriculum have been retrieved successfully',
        data: result,
    });
});

const getPurchasedCourseCurriculum = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result =
        await CourseContentServices.getPurchasedCourseCurriculumFromDB(
            id,
            req.user,
        );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Course curriculum have been retrieved successfully',
        data: result,
    });
});

const getPurchasedSingleCourseContent = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result =
        await CourseContentServices.getPurchasedSingleCourseContentFromDB(
            id,
            req.user,
        );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Course content has been retrieved successfully',
        data: result,
    });
});

const getPurchasedExamWithAnswer = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseContentServices.getPurchasedExamWithAnswerFromDB(
        id,
        req.user,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Course content has been retrieved successfully',
        data: result,
    });
});

const updateCourseContent = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseContentServices.updateCourseContentIntoDB(
        id,
        req.body,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Course content has been updated successfully',
        data: result,
    });
});

const deleteCourseContent = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseContentServices.deleteCourseContentFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Course content has been deleted successfully',
        data: result,
    });
});

const createLiveClass = catchAsync(async (req, res) => {
    const result = await CourseContentServices.createLiveClassIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Live class has been created successfully',
        data: result,
    });
});

const getAllLiveClasses = catchAsync(async (req, res) => {
    const result = await CourseContentServices.getAllLiveClassesFromDB(
        req.query,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Live classes have been retrieved successfully',
        data: result,
    });
});

const getSingleLiveClass = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseContentServices.getSingleLiveClassFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Live class has been retrieved successfully',
        data: result,
    });
});

const updateLiveClass = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseContentServices.updateLiveClassIntoDB(
        id,
        req.body,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Live class has been updated successfully',
        data: result,
    });
});

const deleteLiveClass = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseContentServices.deleteLiveClassFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Live class has been deleted successfully',
        data: result,
    });
});

const createLecture = catchAsync(async (req, res) => {
    const result = await CourseContentServices.createLectureIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Lecture has been created successfully',
        data: result,
    });
});

const getAllLectures = catchAsync(async (req, res) => {
    const result = await CourseContentServices.getAllLecturesFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Lectures have been retrieved successfully',
        data: result,
    });
});

const getSingleLecture = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseContentServices.getSingleLectureFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Lecture has been retrieved successfully',
        data: result,
    });
});

const updateLecture = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseContentServices.updateLectureIntoDB(
        id,
        req.body,
    );
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Lecture has been updated successfully',
        data: result,
    });
});

const deleteLecture = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseContentServices.deleteLectureFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Lecture has been deleted successfully',
        data: result,
    });
});

const createNote = catchAsync(async (req, res) => {
    const result = await CourseContentServices.createNoteIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Note has been created successfully',
        data: result,
    });
});

const getAllNotes = catchAsync(async (req, res) => {
    const result = await CourseContentServices.getAllNotesFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Notes have been retrieved successfully',
        data: result,
    });
});

const getSingleNote = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseContentServices.getSingleNoteFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Note has been retrieved successfully',
        data: result,
    });
});

const updateNote = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseContentServices.updateNoteIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Note has been updated successfully',
        data: result,
    });
});

const deleteNote = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseContentServices.deleteNoteFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Note has been deleted successfully',
        data: result,
    });
});

const createExam = catchAsync(async (req, res) => {
    const result = await CourseContentServices.createExamIntoDB(req.body);
    sendResponse(res, {
        status: httpStatus.CREATED,
        success: true,
        message: 'Exam has been created successfully',
        data: result,
    });
});

const getAllExams = catchAsync(async (req, res) => {
    const result = await CourseContentServices.getAllExamsFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Exams have been retrieved successfully',
        data: result,
    });
});

const getTodaysExams = catchAsync(async (req, res) => {
    const result = await CourseContentServices.getTodaysExamsFromDB(req.query);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Exams have been retrieved successfully',
        data: result,
    });
});

const getSingleExam = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseContentServices.getSingleExamFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Exam has been retrieved successfully',
        data: result,
    });
});

const updateExam = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseContentServices.updateExamIntoDB(id, req.body);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Exam has been updated successfully',
        data: result,
    });
});

const deleteExam = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseContentServices.deleteExamFromDB(id);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: 'Exam has been deleted successfully',
        data: result,
    });
});

export const CourseContentControllers = {
    getAllCourseContents,
    getAllCourseCurriculum,
    getPurchasedCourseCurriculum,
    getPurchasedSingleCourseContent,
    getPurchasedExamWithAnswer,
    updateCourseContent,
    deleteCourseContent,
    createLiveClass,
    getAllLiveClasses,
    getSingleLiveClass,
    updateLiveClass,
    deleteLiveClass,
    createLecture,
    getAllLectures,
    getSingleLecture,
    updateLecture,
    deleteLecture,
    createNote,
    getAllNotes,
    getSingleNote,
    updateNote,
    deleteNote,
    createExam,
    getAllExams,
    getTodaysExams,
    getSingleExam,
    updateExam,
    deleteExam,
};
