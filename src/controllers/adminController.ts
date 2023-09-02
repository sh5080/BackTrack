import { NextFunction, Request, Response } from "express";
import * as adminService from "../services/adminService";
import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";

export const createPopup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { description, images } = req.body;
    const newDescription = await adminService.createPopup({
      description,
      images,
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
