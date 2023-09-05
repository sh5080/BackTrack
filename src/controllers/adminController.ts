import { NextFunction, Request, Response } from "express";
import * as adminService from "../services/adminService";
import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";
import config from "../config";
import path from "node:path";
import * as fs from "node:fs/promises";
import { compressImage } from "../config/compressImage";
const IMG_PATH = config.server.IMG_PATH;
export const createPopup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { description } = req.body;
    let imgNames: string = "";
    console.log("req.file: ", req.file);
    if (req.file) {
      const file = req.file as Express.Multer.File;
      const inputPath = path.join(__dirname, "../../public", file.filename);
      const compressedPath = path.join(
        __dirname,
        "../../public/compressed",
        file.filename
      );

      await compressImage(inputPath, compressedPath, 600, 600);

      const compressedFilename = path.basename(compressedPath);
      const encodedFilename = encodeURIComponent(compressedFilename);

      imgNames = `${IMG_PATH}/${encodedFilename}`;

      await fs.unlink(inputPath);
    }

    const newDescription = await adminService.createPopup({
      description,
      imgNames,
    });

    res.status(201).json({
      message: "팝업이 생성되었습니다.",
      description: newDescription,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
