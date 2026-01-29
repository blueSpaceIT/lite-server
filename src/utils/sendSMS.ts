import config from '../config';

const sendSMS = async (phone: string, message: string) => {
    const msgBody = new URLSearchParams();
    msgBody.append('api_key', config.smsApiKey as string);
    msgBody.append('senderid', config.smsSenderID as string);
    msgBody.append('number', phone);
    msgBody.append('message', message);

    try {
        const response = await fetch('http://bulksmsbd.net/api/smsapi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: msgBody.toString(),
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Err: ', err);
        throw err;
    }
};

export default sendSMS;
