import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import generateRandomString from '../../utils/generateRandomString';
import passwordHash from '../../utils/passwordHash';
import { Student } from './student.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { IStudent } from './student.interface';
import { IChangePassword } from '../user/user.interface';
import passwordMatch from '../../utils/passwordMatch';
import sendSMS from '../../utils/sendSMS';
import generateStudentID from '../../utils/generateStudentID';

// create student
const createStudentIntoDB = async (payload: {
    name: string;
    phone: string;
    password?: string;
}) => {
    // check student
    const student = await Student.findOne({
        phone: payload.phone.trim(),
    }).select('id');
    if (student) {
        throw new AppError(httpStatus.CONFLICT, 'Dublicate phone number');
    }

    // create student data
    const createStudentData: Partial<IStudent> = {
        ...payload,
    };
    createStudentData.id = await generateStudentID(Student);

    const password =
        payload?.password ||
        (await generateRandomString(10)).toLocaleLowerCase();
    createStudentData.password = await passwordHash(password);
    createStudentData.otp = await passwordHash(
        String(Math.round(Math.random() * 999999)),
    );

    await sendSMS(payload.phone, `{ODITI INFO}, Your password ${password}`);

    const result = await Student.create(createStudentData);
    return result;
};

// upsert student
const upsertStudentIntoDB = async (payload: {
    name: string;
    phone: string;
}) => {
    // check student
    const student = await Student.findOne({
        phone: payload.phone.trim(),
    });
    if (student) {
        return student;
    }

    // create student data
    const createStudentData: Partial<IStudent> = {
        ...payload,
    };
    createStudentData.id = await generateStudentID(Student);

    const password = (await generateRandomString(10)).toLocaleLowerCase();
    createStudentData.password = await passwordHash(password);
    createStudentData.otp = await passwordHash(
        String(Math.round(Math.random() * 999999)),
    );

    const result = await Student.create(createStudentData);
    await sendSMS(
        payload.phone.trim(),
        `Oditi Career, Your password is ${password}`,
    );
    return result;
};

// get all students
const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        Student.find({ isDeleted: false }),
        query,
    )
        .search(['name', 'phone', 'nid', 'address'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await fetchQuery.modelQuery;
    const meta = await fetchQuery.countTotal();
    return { result, meta };
};

// get single student
const getSingleStudentFromDB = async (id: string) => {
    const result = await Student.findOne({ id, isDeleted: false });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No user found');
    }
    return result;
};

// get single student by phone
const getSingleStudentByPhoneFromDB = async (phone: string) => {
    const result = await Student.findOne({ phone, isDeleted: false });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No user found');
    }
    return result;
};

// update student
const updateStudentIntoDB = async (id: string, payload: Partial<IStudent>) => {
    const student = await Student.findOne({ id, isDeleted: false });
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No user found');
    }

    if (payload?.name && payload.name === '') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Name cannot be empty');
    }

    const updatedStudentData = {
        ...payload,
    };

    const result = await Student.findByIdAndUpdate(
        student._id,
        updatedStudentData,
        { new: true },
    );
    return result;
};

// update student password
const updateStudentPasswordIntoDB = async (
    id: string,
    payload: IChangePassword,
) => {
    const student = await Student.findOne({ id, isDeleted: false }).select(
        '+password',
    );
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No user found');
    }

    // match old password
    const matchPassword = await passwordMatch(
        payload.oldPassword,
        student.password,
    );
    if (!matchPassword) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Old password has not matched',
        );
    }

    const updatedStudentData = {
        password: await passwordHash(payload.newPassword),
    };

    const result = await Student.findByIdAndUpdate(
        student._id,
        updatedStudentData,
        { new: true },
    );
    return result;
};

// delete student
const deleteStudentFromDB = async (id: string) => {
    const student = await Student.findOne({ id, isDeleted: false });
    if (!student) {
        throw new AppError(httpStatus.NOT_FOUND, 'No user found');
    }

    const result = await Student.findByIdAndUpdate(
        student._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

export const StudentServices = {
    createStudentIntoDB,
    upsertStudentIntoDB,
    getAllStudentsFromDB,
    getSingleStudentFromDB,
    getSingleStudentByPhoneFromDB,
    updateStudentIntoDB,
    updateStudentPasswordIntoDB,
    deleteStudentFromDB,
};
