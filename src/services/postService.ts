import * as Type from "../types/type";
import { BacktrackRepository } from "../models/repositories/backtrack.repository";
import { AppError, CommonError } from "../types/AppError";
import { PostRepository } from "../models/repositories/post.repository";
import { AuthRepository } from "../models/repositories/auth.repository";

export const createPost = async (
  backtrackId: string,
  userId: number,
  description: string,
  imgNames: string
) => {
  try {
    const backtrackData = await BacktrackRepository.getOneBacktrack(
      parseInt(backtrackId)
    );

    if (!backtrackData) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "백킹트랙을 찾을 수 없습니다.",
        400
      );
    }
    if (backtrackData.id !== userId) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "사용자의 백킹트랙이 아닙니다.",
        400
      );
    }

    const now = new Date();
    const krDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    const year = krDate.getFullYear();
    const month = String(krDate.getMonth() + 1).padStart(2, "0");
    const day = String(krDate.getDate()).padStart(2, "0");

    const createdAt = `${year}-${month}-${day}`;

    const postData = await PostRepository.createPost(
      parseInt(backtrackId),
      description,
      imgNames,
      createdAt
    );
    return postData;
  } catch (error) {
    throw error;
  }
};

export const getLatestPosts = async (
  page: number = 1,
  pageSize: number = 8
) => {
  try {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const allPosts = await PostRepository.getPost();
    const sortedPosts = allPosts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    const totalItemsCount = sortedPosts.length;
    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);
    for (const post of paginatedPosts) {
      const backtrackId = post.backtrackId;
      const backtrackData = await BacktrackRepository.getOneBacktrack(
        backtrackId
      );
      const title = backtrackData?.title;
      const backtrackAuthor = backtrackData?.userId;
      const nicknameData = await AuthRepository.findUser(backtrackAuthor);
      post.title = title;
      post.author = nicknameData?.nickname;
    }
    return { paginatedPosts, totalItemsCount };
  } catch (error) {
    throw error;
  }
};

export const getPostsByLikes = async (
  page: number = 1,
  pageSize: number = 8
) => {
  try {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const allPosts = await PostRepository.getPost();

    // 좋아요 수를 기준으로 정렬
    const sortedPosts = allPosts.sort((a, b) => {
      const aLikes = a.likedUsers?.length || 0;
      const bLikes = b.likedUsers?.length || 0;
      return bLikes - aLikes;
    });

    const totalItemsCount = sortedPosts.length;
    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

    for (const post of paginatedPosts) {
      const backtrackId = post.backtrackId;
      const backtrackData = await BacktrackRepository.getOneBacktrack(
        backtrackId
      );
      const title = backtrackData?.title;
      const backtrackAuthor = backtrackData?.userId;
      const nicknameData = await AuthRepository.findUser(backtrackAuthor);
      post.title = title;
      post.author = nicknameData?.nickname;
    }

    return { paginatedPosts, totalItemsCount };
  } catch (error) {
    throw error;
  }
};

export const getOldestPosts = async (
  page: number = 1,
  pageSize: number = 8
) => {
  try {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const allPosts = await PostRepository.getPost();
    const totalItemsCount = allPosts.length;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);
    for (const post of paginatedPosts) {
      const backtrackId = post.backtrackId;
      const backtrackData = await BacktrackRepository.getOneBacktrack(
        backtrackId
      );
      const title = backtrackData?.title;
      const backtrackAuthor = backtrackData?.userId;
      const nicknameData = await AuthRepository.findUser(backtrackAuthor);
      post.title = title;
      post.author = nicknameData?.nickname;
    }
    return { paginatedPosts, totalItemsCount };
  } catch (error) {
    throw error;
  }
};

export const getOnePost = async (id: number) => {
  try {
    const post = await PostRepository.getOnePost(id);
    const backtrackId = post.backtrackId;
    const backtrackData = await BacktrackRepository.getOneBacktrack(
      backtrackId
    );
    const title = backtrackData?.title;
    post.title = title;
    return post;
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (backtrackId: string, userId: number) => {
  try {
    const backtrackData = await BacktrackRepository.getOneBacktrack(
      parseInt(backtrackId)
    );
    if (!backtrackData) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "백킹트랙을 찾을 수 없습니다.",
        400
      );
    }
    if (backtrackData.id !== userId) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "사용자의 백킹트랙이 아닙니다.",
        400
      );
    }

    await PostRepository.deletePostById(parseInt(backtrackId));
  } catch (error) {
    throw error;
  }
};

// 좋아요 추가
export const addLikeToPost = async (username: string, postId: number) => {
  try {
    const postData = await PostRepository.addLikeToPost(username, postId);
    if (postData === null) {
      return null;
    } else return postData.likedUsers.length;
  } catch (error) {
    throw error;
  }
};

// 좋아요 삭제
export const removeLikeFromPost = async (username: string, postId: number) => {
  try {
    const postData = await PostRepository.removeLikeFromPost(username, postId);
    if (postData === null) {
      return null;
    } else return postData.likedUsers.length;
  } catch (error) {
    throw error;
  }
};
