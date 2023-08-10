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
    if (!email.includes("@")) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "이메일 형식에 맞추어 입력해주세요.",
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

/** 로그인 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    const userData = await authService.getUser(username);

    if (!userData.activated) {
      throw new AppError(
        CommonError.UNAUTHORIZED_ACCESS,
        "탈퇴한 회원입니다.",
        400
      );
    }
    const token = await authService.loginUser(username!, password!);

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true,
        maxAge: 3600000,
      })
      .status(200)
      .json({ message: "로그인 성공", user: userData });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 로그아웃 */
export const logout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .clearCookie("token")
      .status(200)
      .json({ message: "로그아웃 되었습니다." });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 내 정보 조회 */
export const getUserInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.body;
    const userData = await authService.getUser(username);
    if (!userData) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "사용자를 찾을 수 없습니다.",
        404
      );
    }
    res.status(200).json({ userData });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 회원 정보 수정 */
export const updateUserInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.user!;
    const { email, password } = req.body;
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{10,20}$/;
    if (!passwordRegex.test(password)) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "비밀번호는 영문, 숫자, 특수문자를 포함하여 10자 이상 20자 이내여야 합니다.",
        400
      );
    }
    const updatedUserData = await authService.updateUser(username, {
      email,
      password,
    });

    res.status(200).json(updatedUserData);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** 회원 탈퇴 */
export const deleteUserInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username: currentUser } = req.user!;
    const deletedUserData = await authService.deleteUser(currentUser);

    if (deletedUserData === undefined) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "탈퇴한 회원입니다.",
        401
      );
    }

    const { name, username, email } = deletedUserData;
    const responseData = { name, username, email };
    res.clearCookie("token").status(200).json(responseData);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
