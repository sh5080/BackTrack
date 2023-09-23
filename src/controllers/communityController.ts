import { NextFunction, Request, Response } from "express";
import * as communityService from "../services/communityService";
import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";

/**커뮤니티 게시글 작성 */

export const createCommunity = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description } = req.body;
    const username = req.user!.username;

    const communityData = await communityService.createCommunity(
      username,
      title,
      description
    );
    if (title.length > 30) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "게시글은 30자 이내로 작성 가능합니다.",
        400
      );
    }

    if (description.length > 400) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "게시글은 400자 이내로 작성 가능합니다.",
        400
      );
    }

    res.status(200).json({ communityData });
  } catch (error) {
    next(error);
  }
};

/**커뮤니티 게시글 조회 */

// export const getCommunity = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const communityData = await communityService.getCommunity();

//     res.status(200).json({ communityData });
//   } catch (error) {
//     next(error);
//   }
// };
