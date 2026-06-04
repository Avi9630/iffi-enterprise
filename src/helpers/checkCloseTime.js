import moment from 'moment-timezone';

export const checkCloseTime = (closingTime) => {
    if (!closingTime) {
        return false;
    }
    const currentTime = moment().tz('Asia/Kolkata');
    const closeTime = moment.tz(closingTime, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata');
    return currentTime.isAfter(closeTime);
};