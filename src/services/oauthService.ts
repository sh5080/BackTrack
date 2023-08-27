import { AuthRepository } from "../models/repositories/auth.repository";
import jwt from "jsonwebtoken";
import config from "../config";
import * as Type from "../types/type";
import { AppError, CommonError } from "../types/AppError";

const ACCESS_TOKEN_SECRET = config.jwt.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = config.jwt.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;

/**
 * OAuth 사용자 회원가입
 */
export const OauthSignupUser = async (user: Type.OauthUser) => {
  try {
    // 이메일과 이름을 기반으로 사용자를 생성하고, 필요한 추가 정보를 설정합니다.
    const newUser: Type.OauthUser = {
      username: await generateUsername(user.username),
      nickname: await generateUsername(user.username),
      email: user.email,
      oauthProvider: user.oauthProvider,
    };

    // 생성된 사용자를 저장하고 반환
    const createdUser = await AuthRepository.saveOauthUser(newUser);

    return createdUser;
  } catch (error) {
    console.error(error);
    throw new AppError(CommonError.UNEXPECTED_ERROR, "간편 로그인 실패", 500);
  }
};

/**
 * 사용자 이름에 랜덤한 접미사를 추가하여 유저네임을 생성
 */
const generateUsername = async (username: string): Promise<string> => {
  const randomSuffix = Math.floor(Math.random() * 10000);
  return `${username.replace(" ", "")}_${randomSuffix}`;
};

/**
 * OAuth 사용자 로그인
 */
export const OauthLoginUser = async (email: string): Promise<object> => {
  const user = await AuthRepository.findUser(undefined, email);

  if (!user) {
    throw new AppError(
      CommonError.RESOURCE_NOT_FOUND,
      "없는 사용자 정보입니다.",
      404
    );
  }

  if (!user.activated) {
    throw new AppError(
      CommonError.UNAUTHORIZED_ACCESS,
      "탈퇴한 회원입니다.",
      400
    );
  }

  const accessToken: string = jwt.sign(
    { username: user.username, role: user.role },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    }
  );

  const refreshToken: string = jwt.sign(
    { username: user.username, role: user.role },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    }
  );

  return { accessToken, refreshToken };
};

/**
 * 이메일로 OAuth 사용자 정보 조회
 */
export const getUserForOauth = async (email: string) => {
  const user = await AuthRepository.findUser(undefined, email);

  return user;
};
