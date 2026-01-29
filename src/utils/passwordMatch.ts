import bcrypt from 'bcrypt';

const passwordMatch = async (
    plainPassword: string,
    hashedPassword: string,
): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

export default passwordMatch;
