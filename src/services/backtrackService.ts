import * as type from "../types/type";
import * as backtrackModel from "../models/backtrackModel";

export const saveBacktrack = async (backtrack: type.Backtrack) => {
  try {
    await backtrackModel.saveBacktrack(backtrack);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
