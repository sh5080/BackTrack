import * as Type from "../types/type";
import { BacktrackRepository } from "../models/repositories/backtrack.repository";

export const createBacktrack = async (
  username: string,
  backtrack: string[][][]
) => {
  try {
    await BacktrackRepository.createBacktrack(username, backtrack);
  } catch (error) {
    throw error;
  }
};
