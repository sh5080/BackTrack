import { NextFunction, Response } from "express";
import * as commentService from "../services/commentService";

import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";
/** 댓글 생성 */

export const createComment = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, comment, option } = req.body;
    const userId = req.user?.userId;

    if (!option) {
      throw new AppError(
        CommonError.UNAUTHORIZED_ACCESS,
        "비정상적인 접근입니다.",
        404
      );
    }

    await commentService.createComment(option, userId!, id, comment);

    res.status(201).json({ id, comment });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** post에 대한 댓글 조회 */
export const getPostCommentsByPostId = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const { page } = req.query;
    const limit = 10;
    const comments = await commentService.getPostCommentsByPostId(
      Number(postId),
      Number(page),
      Number(limit)
    );
    if (comments === undefined) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "댓글을 찾을 수 없습니다.",
        404
      );
    }
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/** community에 대한 댓글 조회 */
export const getCommunityCommentsByCommunityId = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { communityId } = req.params;
    const { page } = req.query;
    const limit = 10;
    const comments = await commentService.getCommunityCommentsByCommunityId(
      Number(communityId),
      Number(page),
      Number(limit)
    );
    if (comments === undefined) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "댓글을 찾을 수 없습니다.",
        404
      );
    }
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
// /** 댓글 수정 */
// export const updateComment = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { commentId } = req.params;
//     const { comment } = req.body;
//     const username = req.user!.username;

//     await commentService.updateComment(
//       String(comment),
//       Number(commentId),
//       username
//     );
//     res.status(200).json({ message: comment });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

// /** 댓글 삭제 */
// export const deleteComment = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { commentId } = req.params;
//     const username = req.user?.username!;

//     await commentService.deleteComment(Number(commentId), username);
//     res.status(200).json({ message: "댓글 삭제가 완료되었습니다." });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };
