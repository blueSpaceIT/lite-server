import crypto from 'crypto';

const secretGenerate = (length: number) => {
    return crypto.randomBytes(length).toString('hex');
};

export default secretGenerate;
