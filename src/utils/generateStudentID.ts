import { Model } from 'mongoose';

const generateStudentID = async <T>(model: Model<T>) => {
    let id = (
        new Date().getFullYear().toString().slice(2) +
        Math.round(Math.random() * 99999999)
            .toString()
            .padStart(10, '0')
    ).padStart(7, '0');
    let uniqeID = false;
    while (!uniqeID) {
        // check data
        const data = await model.findOne({ id }).select('_id');
        if (!data) {
            uniqeID = true;
        } else {
            id = (
                new Date().getFullYear().toString().slice(2) +
                Math.round(Math.random() * 99999999)
                    .toString()
                    .padStart(8, '0')
            ).padStart(10, '0');
        }
    }
    return id;
};

export default generateStudentID;
