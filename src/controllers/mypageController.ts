import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService";
import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";

/** 내 정보 조회 */
export const getUserInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.query;
    const userData = await authService.getUser(username);

    if (!userData) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "사용자를 찾을 수 없습니다.",
        404
      );
    }
    if (username !== req.user!.username) {
      throw new AppError(
        CommonError.UNAUTHORIZED_ACCESS,
        "비정상적인 접근입니다.",
        403
      );
    }
    const resultData = {
      username: userData.username,
      nickname: userData.nickname,
      email: userData.email,
    };

    res.status(200).json(resultData);
  } catch (error) {
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
    const { email, nickname } = req.body;

    const updatedUserData = await authService.updateUser(
      username,
      nickname,
      email
    );

    res.status(200).json(updatedUserData);
  } catch (error) {
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
    next(error);
  }
};
