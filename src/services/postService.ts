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
    const backtrackData = await BacktrackRepository.getOneBacktrackData(
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
