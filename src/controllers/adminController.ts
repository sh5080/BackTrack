import { NextFunction, Request, Response } from "express";
import * as adminService from "../services/adminService";
import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";

export const createCategory = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const newCategory = await adminService.createCategory({
      name,
    });
    res.status(201).json({
      message: "카테고리가 생성되었습니다.",
      category: newCategory,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
