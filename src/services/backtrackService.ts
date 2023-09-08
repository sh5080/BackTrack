import * as type from "../types/type";
import { BacktrackRepository } from "../models/repositories/backtrack.repository";

export const createBacktrack = async (backtrack: type.Backtrack) => {
  try {
    await BacktrackRepository.createBacktrack(backtrack);
  } catch (error) {
    throw error;
  }
};
