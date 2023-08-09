import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService";
import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, email } = req.body;
    const userData = { username, email, password };
    const exceptPassword = { username, email };

    if (username.length < 6 || username.length > 20) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "아이디는 6자 이상 20자 이내로 설정해야 합니다.",
        400
      );
    }
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{10,20}$/;
    if (!passwordRegex.test(password)) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "비밀번호는 영문, 숫자, 특수문자를 포함하여 10자 이상 20자 이내여야 합니다.",
        400
      );
    }

    await authService.signupUser(userData);
    res.status(201).json(exceptPassword);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
