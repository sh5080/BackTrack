import * as Type from "../types/type";
import { BacktrackRepository } from "../models/repositories/backtrack.repository";

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

    return paginatedBacktracks;
  } catch (error) {
    throw error;
  }
};

export const getBacktrackPage = async (username: string) => {
  try {
    const page = await BacktrackRepository.getBacktrack(username);

    return page.length;
  } catch (error) {
    throw error;
  }
};

export const getBacktrackData = async (username: string, title: string) => {
  try {
    const backtrackData = await BacktrackRepository.getBacktrackData(
      username,
      title
    );

    return backtrackData;
  } catch (error) {
    throw error;
  }
};
