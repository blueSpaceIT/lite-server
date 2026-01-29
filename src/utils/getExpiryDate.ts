import moment from 'moment';

const getExpiryDate = ([amount, unit]: [number, string]): Date => {
    return moment()
        .add(
            amount,
            unit.toLowerCase() as moment.unitOfTime.DurationConstructor,
        )
        .toDate();
};

export default getExpiryDate;
