import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import config from "../config";
import * as Type from "../types/type";
import { AppError, CommonError } from "../types/AppError";
import { AuthRepository } from "../models/repositories/auth.repository";
import { BacktrackRepository } from "../models/repositories/backtrack.repository";
import * as nodemailer from "../config/nodemailer";
import { AppDataSource } from "../loaders/dbLoader";
import * as postService from "./postService";
import { PostRepository } from "../models/repositories/post.repository";
const { saltRounds } = config.bcrypt;
const ACCESS_TOKEN_SECRET = config.jwt.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = config.jwt.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = config.jwt.ACCESS_TOKEN_EXPIRES_IN;

/**
 * 사용자 닉네임, 이메일 업데이트
 */
export const updateUser = async (
  id: number,
  nickname: string,
  email: string
) => {
  try {
    const existingUser = await AuthRepository.findUser(id);

    if (!existingUser) {
      throw new AppError(
        CommonError.UNEXPECTED_ERROR,
        "사용자 정보를 찾을 수 없습니다.",
        404
      );
    }

    if (email === existingUser.email) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "새로운 이메일을 입력해주세요.",
        400
      );
    }
    if (nickname === existingUser.nickname) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "새로운 닉네임을 입력해주세요.",
        400
      );
    }

    const existingNickname = await AuthRepository.findUser(
      undefined,
      undefined,
      nickname
    );

    if (existingNickname) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "이미 사용중인 닉네임입니다.",
        400
      );
    }

    const updatedUser = await AuthRepository.updateUser(
      id,
      undefined,
      nickname,
      email
    );

    if (!updatedUser) {
      throw new AppError(
        CommonError.UNEXPECTED_ERROR,
        "사용자 정보 수정에 실패했습니다.",
        500
      );
    }

    const { ...userInfo } = updatedUser;
    return userInfo;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        CommonError.UNEXPECTED_ERROR,
        "회원정보 수정에 실패했습니다.",
        500
      );
    }
  }
};

/**
 * 사용자 패스워드 업데이트
 */

export const updatePassword = async (
  id: number,
  password: string,
  newPassword: string
) => {
  try {
    const existingUser = await AuthRepository.findUser(id);

    if (!existingUser) {
      throw new AppError(
        CommonError.UNEXPECTED_ERROR,
        "사용자 정보를 찾을 수 없습니다.",
        404
      );
    }

    if (password) {
      const isPasswordMatch = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isPasswordMatch) {
        throw new AppError(
          CommonError.AUTHENTICATION_ERROR,
          "기존 비밀번호가 일치하지 않습니다.",
          401
        );
      }
    }

    const updatedUser = await AuthRepository.updateUser(id, newPassword);

    if (!updatedUser) {
      throw new AppError(
        CommonError.UNEXPECTED_ERROR,
        "사용자 정보 수정에 실패했습니다.",
        500
      );
    }

    const { ...userInfo } = updatedUser;
    return userInfo;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        CommonError.UNEXPECTED_ERROR,
        "회원정보 수정에 실패했습니다.",
        500
      );
    }
  }
};

/**
 * 사용자 삭제
 */
export const deleteUser = async (id: number) => {
  try {
    const deletedUser = await AuthRepository.deleteUser(id);
    return deletedUser;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        CommonError.UNEXPECTED_ERROR,
        "회원탈퇴에 실패했습니다.",
        500
      );
    }
  }
};

export const getMyPostsInfo = async (
  id: number,
  page: number,
  pageSize: number
) => {
  try {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const allBacktracks = await BacktrackRepository.getMyBacktrack(id);
    const ids = allBacktracks.map((backtrack) => backtrack.id);
    const posts = await PostRepository.getMyPosts(ids);
    const totalItems = posts.length;
    const paginatedMyPosts = posts.slice(startIndex, endIndex);
    if (paginatedMyPosts.length === 0) {
      return null;
    }
    return { paginatedMyPosts, totalItems };
  } catch (error) {
    throw error;
  }
};

export const getPaginatedLikedPosts = async (
  likedPostArray: number[],
  page: number,
  pageSize: number
) => {
  try {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedLikedPosts = likedPostArray.slice(startIndex, endIndex);

    const likedPostTitles = await Promise.all(
      paginatedLikedPosts.map(async (postId) => {
        const post = await postService.getOnePost(postId);
        return post ? { [postId]: post.title } : null;
      })
    );

    return likedPostTitles.filter((title) => title !== null);
  } catch (error) {
    throw error;
  }
};
