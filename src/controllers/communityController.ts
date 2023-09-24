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
    const userId = req.user!.userId;

    const communityData = await communityService.createCommunity(
      userId,
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

/** 게시글 특정 조회 */
export const getOneCommunity = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const communityData = await communityService.getOneCommunity(parseInt(id));

    res.json({ communityData });
  } catch (error) {
    next(error);
  }
};

/** 게시글 전체 조회 */
export const getCommunity = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page;
    const sortBy = req.query.sortBy;

    let communityData;

    if (sortBy === "oldest") {
      communityData = await communityService.getOldestCommunities(
        parseInt(page)
      );
    }
    // 추후 조회수 관련 정렬 가능성 있음
    // else if (sortBy === "likes") {
    //   communityData = await communityService.getCommunitiesByLikes(
    //     parseInt(page)
    //   );
    // }
    else {
      communityData = await communityService.getLatestCommunities(
        parseInt(page)
      );
    }

    if (communityData.paginatedCommunities.length < 1) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "조회된 게시글이 없습니다.",
        400
      );
    }
    res.json({ message: "게시글 조회 완료되었습니다.", communityData });
  } catch (error) {
    next(error);
  }
};
