import * as Type from "../types/type";
import { BacktrackRepository } from "../models/repositories/backtrack.repository";
import { AppError, CommonError } from "../types/AppError";
import { CommunityRepository } from "../models/repositories/community.repository";
import { AuthRepository } from "../models/repositories/auth.repository";

export const createCommunity = async (
  userId: number,
  title: string,
  description: string
) => {
  try {
    const now = new Date();
    const krDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    const year = krDate.getFullYear();
    const month = String(krDate.getMonth() + 1).padStart(2, "0");
    const day = String(krDate.getDate()).padStart(2, "0");

    const createdAt = `${year}-${month}-${day}`;

    const CommunityData = await CommunityRepository.createCommunity(
      userId,
      title,
      description,
      createdAt
    );

    return CommunityData;
  } catch (error) {
    throw error;
  }
};

export const getOneCommunity = async (id: number) => {
  try {
    const community = await CommunityRepository.getOneCommunity(id);
    if (!community) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "조회되는 게시글이 없습니다.",
        400
      );
    }
    return community;
  } catch (error) {
    throw error;
  }
};

export const getLatestCommunities = async (
  page: number = 1,
  pageSize: number = 8
) => {
  try {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const allCommunities = await CommunityRepository.getCommunity();
    const sortedCommunities = allCommunities.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    const totalItemsCount = sortedCommunities.length;
    const paginatedCommunities = sortedCommunities.slice(startIndex, endIndex);

    return { paginatedCommunities, totalItemsCount };
  } catch (error) {
    throw error;
  }
};

// export const getCommunitiesByLikes = async (
//   page: number = 1,
//   pageSize: number = 8
// ) => {
//   try {
//     const startIndex = (page - 1) * pageSize;
//     const endIndex = startIndex + pageSize;
//     const allCommunities = await CommunityRepository.getCommunity();

//     // 좋아요 수를 기준으로 정렬
//     const sortedCommunities = allCommunities.sort((a, b) => {
//       const aLikes = a.likedUsers?.length || 0;
//       const bLikes = b.likedUsers?.length || 0;
//       return bLikes - aLikes;
//     });

//     const totalItemsCount = sortedCommunities.length;
//     const paginatedCommunities = sortedCommunities.slice(startIndex, endIndex);

//     return { paginatedCommunities, totalItemsCount };
//   } catch (error) {
//     throw error;
//   }
// };

export const getOldestCommunities = async (
  page: number = 1,
  pageSize: number = 8
) => {
  try {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const allCommunities = await CommunityRepository.getCommunity();
    const totalItemsCount = allCommunities.length;
    const paginatedCommunities = allCommunities.slice(startIndex, endIndex);

    return { paginatedCommunities, totalItemsCount };
  } catch (error) {
    throw error;
  }
};

// export const deleteCommunity = async (
//   backtrackId: string,
//   username: string
// ) => {
//   try {
//     const backtrackData = await BacktrackRepository.getOneBacktrack(
//       parseInt(backtrackId)
//     );
//     if (!backtrackData) {
//       throw new AppError(
//         CommonError.RESOURCE_NOT_FOUND,
//         "백킹트랙을 찾을 수 없습니다.",
//         400
//       );
//     }
//     if (backtrackData.username !== username) {
//       throw new AppError(
//         CommonError.INVALID_INPUT,
//         "사용자의 백킹트랙이 아닙니다.",
//         400
//       );
//     }

//     await CommunityRepository.deleteCommunityById(parseInt(backtrackId));
//   } catch (error) {
//     throw error;
//   }
// };

// // 좋아요 추가
// export const addLikeToCommunity = async (
//   username: string,
//   CommunityId: number
// ) => {
//   try {
//     const CommunityData = await CommunityRepository.addLikeToCommunity(
//       username,
//       CommunityId
//     );
//     if (CommunityData === null) {
//       return null;
//     } else return CommunityData.likedUsers.length;
//   } catch (error) {
//     throw error;
//   }
// };

// // 좋아요 삭제
// export const removeLikeFromCommunity = async (
//   username: string,
//   CommunityId: number
// ) => {
//   try {
//     const CommunityData = await CommunityRepository.removeLikeFromCommunity(
//       username,
//       CommunityId
//     );
//     if (CommunityData === null) {
//       return null;
//     } else return CommunityData.likedUsers.length;
//   } catch (error) {
//     throw error;
//   }
// };
