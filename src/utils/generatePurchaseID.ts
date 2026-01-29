import { Types } from 'mongoose';
import { ICourse } from '../modules/course/course.interface';
import { IBranch } from '../modules/branch/branch.interface';
import { Purchase } from '../modules/purchase/purchase.model';

const generatePurchaseID = async (
    branch: IBranch & { _id: Types.ObjectId },
    course: ICourse & { _id: Types.ObjectId },
) => {
    const existingLastID = await Purchase.find({
        course: course._id,
        branch: branch._id,
    })
        .select('_id id')
        .sort('-id')
        .limit(1);
    if (!existingLastID || existingLastID.length === 0) {
        return course.code + branch.code + course.typeCode + '0001';
    } else {
        return String(Number(existingLastID[0].id) + 1);
    }
};

export default generatePurchaseID;
