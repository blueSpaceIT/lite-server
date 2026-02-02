import fs from 'fs';
import path from 'path';
import { buildUploadPath } from './mediaPath';

export const mergeChunks = async (
    uploadId: string,
    totalChunks: number,
    finalFileName: string,
) => {
    const tempDir = buildUploadPath(`videos/.tmp/${uploadId}`);
    const finalDir = buildUploadPath('videos');

    fs.mkdirSync(finalDir, { recursive: true });

    const finalPath = path.join(finalDir, finalFileName);
    const writeStream = fs.createWriteStream(finalPath);

    for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join(tempDir, `${i}.part`);
        const data = fs.readFileSync(chunkPath);
        writeStream.write(data);
        fs.unlinkSync(chunkPath);
    }

    writeStream.end();

    fs.rmSync(tempDir, { recursive: true, force: true });

    return finalPath;
};
