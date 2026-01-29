const generateRandomString = async (tokenLength: number) => {
    const characters = 'ABCDEFGHIJKLMN0123456789PQRSTUVWXYZ';
    const charactersLength = characters.length;
    let id = '';

    for (let i = 0; i < tokenLength; i++) {
        const randomIndex = Math.round(Math.random() * charactersLength);
        id += characters[randomIndex];
    }

    return id;
};

export default generateRandomString;
