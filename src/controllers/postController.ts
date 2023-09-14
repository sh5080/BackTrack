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
