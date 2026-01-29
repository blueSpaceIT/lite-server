import slugify from 'slugify';

const slugGenerate = (name: string) => {
    return slugify(name, {
        remove: /[*+~.()'"!:@]/g,
        lower: true,
    });
};

export default slugGenerate;
