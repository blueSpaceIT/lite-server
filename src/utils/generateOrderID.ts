import { Model } from 'mongoose';

const generateOrderID = async <T>(model: Model<T>) => {
    let id = 'OID-' + String(Math.round(Math.random() * 9999999999));
    let uniqeID = false;
    while (!uniqeID) {
        // check data
        const data = await model.findOne({ id }).select('_id');
        if (!data) {
            uniqeID = true;
        } else {
            id = 'PC-' + String(Math.round(Math.random() * 9999999999));
        }
    }
    return id;
};

export default generateOrderID;
