import * as Type from "../types/type";
import { BacktrackRepository } from "../models/repositories/backtrack.repository";
import { AppError, CommonError } from "../types/AppError";
import { PostRepository } from "../models/repositories/post.repository";

export const createPost = async (
  backtrackId: string,
  username: string,
  description: string
) => {
  try {
    console.log("b_id: ", backtrackId);
    console.log("desc: ", description);
    const backtrackData = await BacktrackRepository.getBacktrackDetail(
      parseInt(backtrackId)
    );

    if (!backtrackData) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "백킹트랙을 찾을 수 없습니다.",
        400
      );
    }
    if (backtrackData.username !== username) {
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

    await PostRepository.createPost(
      parseInt(backtrackId),
      description,
      createdAt
    );
  } catch (error) {
    throw error;
  }
};

export const getPost = async (page: number = 1, pageSize: number = 8) => {
  try {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const allPosts = await PostRepository.getPost();
    const totalItemsCount = allPosts.length;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);
    for (const post of paginatedPosts) {
      const backtrackId = post.backtrackId;
      const backtrackData = await BacktrackRepository.getBacktrackDetail(
        backtrackId
      );
      const title = backtrackData?.title;
      const username = backtrackData?.username;

      post.title = title;
      post.author = username;
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
    const backtrackData = await BacktrackRepository.getBacktrackDetail(
      backtrackId
    );
    const title = backtrackData?.title;
    post.title = title;
    return post;
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (backtrackId: string, username: string) => {
  try {
    const backtrackData = await BacktrackRepository.getBacktrackDetail(
      parseInt(backtrackId)
    );
    if (!backtrackData) {
      throw new AppError(
        CommonError.RESOURCE_NOT_FOUND,
        "백킹트랙을 찾을 수 없습니다.",
        400
      );
    }
    if (backtrackData.username !== username) {
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
