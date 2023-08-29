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
    const { username } = req.user!;
    const userData = await authService.getUser(username);

    if (!userData) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "사용자를 찾을 수 없습니다.",
        404
      );
    }
    // if (username !== req.user!.username) {
    //   throw new AppError(
    //     CommonError.UNAUTHORIZED_ACCESS,
    //     "비정상적인 접근입니다.",
    //     403
    //   );
    // }
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
    const { email, nickname, password, newPassword, newPasswordConfirm } =
      req.body;
    console.log(req.body);
    // if (username !== req.user!.username) {
    //   throw new AppError(
    //     CommonError.UNAUTHORIZED_ACCESS,
    //     "비정상적인 접근입니다.",
    //     403
    //   );
    // }
    const userData = await authService.getUser(username);
    if (userData?.oauth_provider !== "ORIGIN") {
      throw new AppError(
        CommonError.UNAUTHORIZED_ACCESS,
        "간편로그인 회원은 해당 로그인서비스에서 비밀번호 변경이 가능합니다.",
        403
      );
    }

    if (password !== userData?.password) {
      throw new AppError(
        CommonError.AUTHENTICATION_ERROR,
        "기존 비밀번호가 일치하지 않습니다.",
        400
      );
    }
    if (newPassword !== newPasswordConfirm) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "새 비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        400
      );
    }
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{10,20}$/;
    if (!passwordRegex.test(newPassword)) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "비밀번호는 영문, 숫자, 특수문자를 포함하여 10자 이상 20자 이내여야 합니다.",
        400
      );
    }
    const updatedUserData = await authService.updateUser(
      username,
      password,
      newPassword,
      nickname,
      email
    );

    if (email === undefined) {
      res.status(200).json(updatedUserData.nickname);
    }
    if (nickname === undefined) {
      res.status(200).json(updatedUserData.email);
    }
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
