import config from '../config';
import { USER_ROLES } from '../modules/user/user.constant';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import passwordHash from '../utils/passwordHash';
import slugGenerate from '../utils/slugGenerate';
import { IAdmin } from '../modules/admin/admin.interface';
import { Admin } from '../modules/admin/admin.model';

// super admin data
const superAdminDataDev: Partial<IAdmin> = {
    name: 'Mehedi Hasan',
    phone: '01616720009',
    password: config.superAdminPassword as string,
    designation: 'Software Engineer',
    role: USER_ROLES.superAdmin,
    status: 'Active',
};

// super admin data
const superAdminData: Partial<IAdmin> = {
    name: 'Ahsanul Haque',
    phone: '01713573680',
    password: config.superAdminPassword as string,
    designation: 'Director',
    role: USER_ROLES.superAdmin,
    status: 'Active',
};

// super admin query
const superAdminQuery = { role: USER_ROLES.superAdmin };

const seedSuperAdmin = async () => {
    // check count of super admins, if it grater than limit of super admin delete all and initialize it
    const totalSuperAdmins = await Admin.countDocuments(superAdminQuery);
    if (totalSuperAdmins > Number(config.superAdminLimit)) {
        await Admin.deleteMany(superAdminQuery);
    }
    // check if any super admin exist, if no one then seed super admin
    const isSuperAdminExist = await Admin.findOne(superAdminQuery);
    if (!isSuperAdminExist) {
        const isUserExist = await Admin.isAdminExistByPhone(
            superAdminData?.phone as string,
        );
        if (isUserExist?.phone) {
            throw new AppError(
                httpStatus.CONFLICT,
                'This phone has already exist',
            );
        }
        superAdminData.id =
            slugGenerate(superAdminData.name as string) +
            '-' +
            (superAdminData.phone as string).slice(7, 11);

        // check user id
        const userID = await Admin.findOne({ id: superAdminData.id }).select(
            'id',
        );
        if (userID) {
            throw new AppError(
                httpStatus.CONFLICT,
                'This userID has been taken',
            );
        }

        superAdminData.password = await passwordHash(
            superAdminData.password as string,
        );
        superAdminData.otp = await passwordHash(
            String(Math.round(Math.random() * 999999)),
        );

        await Admin.create(superAdminData);

        const isUserExistDev = await Admin.isAdminExistByPhone(
            superAdminDataDev?.phone as string,
        );
        if (isUserExistDev?.phone) {
            throw new AppError(
                httpStatus.CONFLICT,
                'This email has already exist',
            );
        }
        superAdminDataDev.id =
            slugGenerate(superAdminDataDev.name as string) +
            '-' +
            (superAdminDataDev.phone as string).slice(7, 11);

        // check user id
        const userIDDev = await Admin.findOne({
            id: superAdminDataDev.id,
        }).select('id');
        if (userIDDev) {
            throw new AppError(
                httpStatus.CONFLICT,
                'This userID has been taken',
            );
        }

        superAdminDataDev.password = await passwordHash(
            superAdminDataDev.password as string,
        );
        superAdminDataDev.otp = await passwordHash(
            String(Math.round(Math.random() * 999999)),
        );

        await Admin.create(superAdminDataDev);
    }
};

export default seedSuperAdmin;
