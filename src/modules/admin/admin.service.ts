import httpStatus from 'http-status';
import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';
import AppError from '../../errors/AppError';
import slugGenerate from '../../utils/slugGenerate';
import passwordHash from '../../utils/passwordHash';
import { Branch } from '../branch/branch.model';
import { USER_ROLES } from '../user/user.constant';
import QueryBuilder from '../../builder/QueryBuilder';
import { IChangePassword } from '../user/user.interface';
import passwordMatch from '../../utils/passwordMatch';
import { ADMIN_ROLES } from './admin.constant';

// create admin
const createAdminIntoDB = async (payload: IAdmin) => {
    // check user
    const user = await Admin.findOne({ phone: payload.phone }).select('id');
    if (user) {
        throw new AppError(httpStatus.CONFLICT, 'Dublicate phone number');
    }

    // create admin data
    const createAdminData = {
        ...payload,
    };
    createAdminData.id =
        slugGenerate(createAdminData.name) +
        '-' +
        createAdminData.phone.slice(7, 11);

    // check admin id
    const adminID = await Admin.findOne({ id: createAdminData.id }).select(
        'id',
    );
    if (adminID) {
        throw new AppError(httpStatus.CONFLICT, 'This userID has been taken');
    }

    if (payload?.branch) {
        // check branch
        const branch = await Branch.findOne({ id: payload.branch }).select(
            'id',
        );
        if (!branch) {
            throw new AppError(httpStatus.NOT_FOUND, 'No branch found');
        }
        createAdminData.branch = branch._id;
    }

    createAdminData.password = payload?.password ?? '12345678';
    // createAdminData.password =
    //     payload?.password ||
    //     (await generateRandomString(10)).toLocaleLowerCase();
    createAdminData.password = await passwordHash(createAdminData.password);
    createAdminData.otp = await passwordHash(
        String(Math.round(Math.random() * 999999)),
    );

    const result = await Admin.create(createAdminData);
    return result;
};

// get all admins
const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        Admin.find({
            role: { $ne: USER_ROLES.superAdmin },
            isDeleted: false,
        }).populate('branch'),
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

// get all deleted admins
const getAllDeletedAdminsFromDB = async (query: Record<string, unknown>) => {
    const fetchQuery = new QueryBuilder(
        Admin.find({
            role: { $ne: USER_ROLES.superAdmin },
            isDeleted: true,
        }).populate('branch'),
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

// get teams
const getTeamsFromDB = async () => {
    const result = await Admin.find({
        role: { $ne: ADMIN_ROLES.superAdmin },
        status: 'Active',
        isDeleted: false,
    }).select('id name designation quote image');
    return result;
};

// get single admin
const getSinglAdminFromDB = async (id: string) => {
    const result = await Admin.findOne({ id, isDeleted: false }).populate(
        'branch',
    );
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'No user found');
    }
    return result;
};

// update admin
const updateAdminIntoDB = async (id: string, payload: Partial<IAdmin>) => {
    const admin = await Admin.findOne({ id });
    if (!admin) {
        throw new AppError(httpStatus.NOT_FOUND, 'No user found');
    }

    if (payload?.name && payload.name === '') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Name cannot be empty');
    }

    const updatedAdminData = {
        ...payload,
    };

    if (payload?.branch) {
        // check branch
        const branch = await Branch.findOne({ id: payload.branch }).select(
            'id',
        );
        if (!branch) {
            throw new AppError(httpStatus.NOT_FOUND, 'No branch found');
        }
        updatedAdminData.branch = branch._id;
    }

    const result = await Admin.findByIdAndUpdate(admin._id, updatedAdminData, {
        new: true,
    });
    return result;
};

// update admin password
const updateAdminPasswordIntoDB = async (
    id: string,
    payload: IChangePassword,
) => {
    const admin = await Admin.findOne({ id, isDeleted: false }).select(
        '+password',
    );
    if (!admin) {
        throw new AppError(httpStatus.NOT_FOUND, 'No user found');
    }

    // match old password
    const matchPassword = await passwordMatch(
        payload.oldPassword,
        admin.password,
    );
    if (!matchPassword) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Old password has not matched',
        );
    }

    const updatedAdminData = {
        password: await passwordHash(payload.newPassword),
    };

    const result = await Admin.findByIdAndUpdate(admin._id, updatedAdminData, {
        new: true,
    });
    return result;
};

// delete admin
const deleteAdminFromDB = async (id: string) => {
    const admin = await Admin.findOne({ id, isDeleted: false });
    if (!admin) {
        throw new AppError(httpStatus.NOT_FOUND, 'No user found');
    }

    const result = await Admin.findByIdAndUpdate(
        admin._id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

// delete permanent admin
const deletePermanentAdminFromDB = async (id: string) => {
    const admin = await Admin.findOne({ id });
    if (!admin) {
        throw new AppError(httpStatus.NOT_FOUND, 'No user found');
    }

    const result = await Admin.findByIdAndDelete(admin._id);
    return result;
};

export const AdminServices = {
    createAdminIntoDB,
    getAllAdminsFromDB,
    getAllDeletedAdminsFromDB,
    getTeamsFromDB,
    getSinglAdminFromDB,
    updateAdminIntoDB,
    updateAdminPasswordIntoDB,
    deleteAdminFromDB,
    deletePermanentAdminFromDB,
};
