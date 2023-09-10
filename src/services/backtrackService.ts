import * as Type from "../types/type";
import { BacktrackRepository } from "../models/repositories/backtrack.repository";

export const createBacktrack = async (
  username: string,
  title: string,
  backtrack: string[][][]
) => {
  try {
    await BacktrackRepository.createBacktrack(username, title, backtrack);
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
