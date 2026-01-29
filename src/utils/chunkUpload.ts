import { Request, Response } from "express";
import fs from "fs";
import httpStatus from 'http-status';
import path from "path";
import { pipeline } from "stream/promises";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import { buildUploadPath } from "./mediaPath";

export const chunkUpload = catchAsync(
  async (req: Request, res: Response) => {
    const uploadId = req.headers["uploadid"];
    const chunkIndex = req.headers["chunkindex"];

    if (typeof uploadId !== "string" || typeof chunkIndex !== "string") {
      return sendResponse(res, {
        status: httpStatus.BAD_REQUEST,
        success: false,
        message: "uploadId and chunkIndex are required",
        data: null,
      });
    }

    const tempDir = buildUploadPath(`videos/.tmp/${uploadId}`);
    fs.mkdirSync(tempDir, { recursive: true });

    const chunkPath = path.join(tempDir, `${chunkIndex}.part`);
    const writeStream = fs.createWriteStream(chunkPath);

    await pipeline(req, writeStream);

    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Chunk uploaded successfully",
      data: {
        uploadId,
        chunkIndex,
      },
    });
  }
);
