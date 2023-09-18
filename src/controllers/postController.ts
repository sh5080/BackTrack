import { NextFunction, Request, Response } from "express";
import * as postService from "../services/postService";
import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";

/** 게시글 생성 */
export const createPost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { description } = req.body;
    const username = req.user!.username;
    const { backtrackId } = req.query;
    if (description.length > 30) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "소개는 200자 이내로 작성 가능합니다.",
        400
      );
    }

    const postData = await postService.createPost(
      backtrackId,
      username,
      description
    );

    res.json({ message: "게시글 생성이 완료되었습니다.", postData });
  } catch (error) {
    next(error);
  }
};

/** 게시글 조회 */
export const getPost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page;
    const postData = await postService.getPost(parseInt(page));
    if (postData.paginatedPosts.length < 1) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "조회된 게시글이 없습니다.",
        400
      );
    }
    res.json({ message: "게시글 조회 완료되었습니다.", postData });
  } catch (error) {
    next(error);
  }
};

/** 게시글 삭제 */
export const deletePost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.user!.username;
    const { backtrackId } = req.query;

    const deletedData = await postService.deletePost(backtrackId, username);

    res.json({ message: "게시글 생성이 완료되었습니다.", deletedData });
  } catch (error) {
    next(error);
  }
};
export const addLikeToPost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.user!.username;
    const { postId } = req.body;

    const result = await postService.addLikeToPost(username, postId);

    return res.status(200).json(`likesCount: ${result}`);
  } catch (error) {
    next(error);
  }
};

export const removeLikeFromPost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.user!.username;
    const { postId } = req.params;
    const result = await postService.removeLikeFromPost(
      username,
      parseInt(postId)
    );

    console.log(result);
    return res.status(200).json(`likesCount: ${result}`);
  } catch (error) {
    next(error);
  }
};
