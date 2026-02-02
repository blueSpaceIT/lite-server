import path from 'path';

const UPLOADS_ROOT = path.join(process.cwd(), 'uploads');

export const toPublicPath = (absolutePath: string): string => {
    return (
        '/uploads/' +
        path.relative(UPLOADS_ROOT, absolutePath).replace(/\\/g, '/')
    );
};

export const getUploadsRoot = () => UPLOADS_ROOT;

export const buildUploadPath = (folder: string) => {
    return path.join(UPLOADS_ROOT, folder);
};
