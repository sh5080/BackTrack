import { NextFunction, Request, Response } from "express";
import * as mypageService from "../services/mypageService";
import * as authService from "../services/authService";
import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";
import bcrypt from "bcrypt";
import config from "../config";
import { getSessionFromRedis, saveSessionToRedis } from "../config/redis";
const { saltRounds } = config.bcrypt;
/** 내 정보 조회 */
export const getUserInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!;
    const userData = await authService.getUser(userId);

    if (!userData) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "비정상적인 접근입니다.",
        404
      );
    }

    const resultData = {
      username: userData.username,
      nickname: userData.nickname,
      email: userData.email,
      likedPosts: userData.likedPosts,
    };

    res.status(200).json(resultData);
  } catch (error) {
    next(error);
  }
};
export const getMyPostsInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page;
    const pageSize = 10;
    const { userId } = req.user!;
    const myPostData = await mypageService.getMyPostsInfo(
      userId,
      parseInt(page),
      pageSize
    );
    res.json(myPostData);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const getLikesInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page;
    const { userId } = req.user!;
    const userData = await authService.getUser(userId);
    const pageSize = 10;
    if (!userData) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "비정상적인 접근입니다.",
        404
      );
    }
    const likedPostArray = userData.likedPosts;
    const filteredLikedPostTitles = await mypageService.getPaginatedLikedPosts(
      likedPostArray,
      parseInt(page),
      pageSize
    );

    if (filteredLikedPostTitles.length < 1) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "조회된 게시글이 없습니다.",
        400
      );
    }
    const totalItems = likedPostArray.length;
    res.json({
      filteredLikedPostTitles,
      totalItems,
    });
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
    const { userId } = req.user!;
    const { email, nickname } = req.body;

    const updatedUserData = await mypageService.updateUser(
      userId,
      nickname,
      email
    );
    if (!email.includes("@") || !email.includes(".")) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "이메일 형식에 맞추어 입력해주세요.",
        400
      );
    }

    if (nickname && email === undefined) {
      const sessionData = await getSessionFromRedis(userId);
      if (sessionData) {
        await saveSessionToRedis(
          userId,
          nickname,
          sessionData.refreshToken,
          3600000
        );
      }
      res.status(200).json(updatedUserData.nickname);
    } else if (email && nickname === undefined) {
      res.status(200).json(updatedUserData.email);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updatePassword = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!;
    const { password, newPassword, newPasswordConfirm } = req.body;

    const userData = await authService.getUser(userId);
    if (
      userData?.oauth_provider === "KAKAO" ||
      userData?.oauth_provider === "GOOGLE"
    ) {
      throw new AppError(
        CommonError.UNAUTHORIZED_ACCESS,
        "간편로그인 회원은 해당 로그인서비스에서 비밀번호 변경이 가능합니다.",
        403
      );
    } else if (userData?.oauth_provider !== "ORIGIN") {
      throw new AppError(
        CommonError.UNAUTHORIZED_ACCESS,
        "비정상적인 접근입니다.",
        403
      );
    }
    if (password && password === newPassword) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "새로운 비밀번호를 입력해주세요.",
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
    if (newPassword && !passwordRegex.test(newPassword)) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "비밀번호는 영문, 숫자, 특수문자를 포함하여 10자 이상 20자 이내여야 합니다.",
        400
      );
    }
    const hashedNewPassword = await bcrypt.hash(
      String(newPassword),
      saltRounds
    );
    const updatedUserData = await mypageService.updatePassword(
      userId,
      password,
      hashedNewPassword
    );

    res
      .status(200)
      .json({ message: "성공적으로 비밀번호 변경이 완료되었습니다." });
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
    const { id: currentUser } = req.user!;
    const deletedUserData = await mypageService.deleteUser(currentUser);

    if (deletedUserData === undefined) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "탈퇴한 회원입니다.",
        401
      );
    }

    const { nickname, id, email } = deletedUserData;
    const responseData = { nickname, id, email };
    res.clearCookie("token").status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};
