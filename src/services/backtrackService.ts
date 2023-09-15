import * as Type from "../types/type";
import { BacktrackRepository } from "../models/repositories/backtrack.repository";
import { AppError, CommonError } from "../types/AppError";

export const createBacktrack = async (
  username: string,
  title: string,
  backtrack: string[][][]
) => {
  try {
    const now = new Date(); // 현재 시간을 가져옴

    // 한국 시간으로 변환
    const krDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    const year = krDate.getFullYear();
    const month = String(krDate.getMonth() + 1).padStart(2, "0");
    const day = String(krDate.getDate()).padStart(2, "0");

    const createdAt = `${year}-${month}-${day}`;

    await BacktrackRepository.createBacktrack(
      username,
      title,
      backtrack,
      createdAt
    );
  } catch (error) {
    throw error;
  }
};

export const getBacktrack = async (
  username: string,
  page: number = 1,
  pageSize: number = 10
) => {
  try {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const allBacktracks = await BacktrackRepository.getBacktrack(username);

    const paginatedBacktracks = allBacktracks.slice(startIndex, endIndex);
    const totalPage = allBacktracks.length;

    return { paginatedBacktracks, totalPage };
  } catch (error) {
    throw error;
  }
};

export const getBacktrackDetail = async (id: number) => {
  try {
    const backtrackData = await BacktrackRepository.getBacktrackDetail(id);

    return backtrackData;
  } catch (error) {
    throw error;
  }
};

export const deleteBacktrack = async (
  backtrackId: string,
  username: string
) => {
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

    await BacktrackRepository.deleteBacktrackById(parseInt(backtrackId));
  } catch (error) {
    throw error;
  }
};
