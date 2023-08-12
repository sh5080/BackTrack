import * as type from "../types/type";
import { AppError, CommonError } from "../types/AppError";
import { db } from "../loaders/dbLoader";

export const saveBacktrack = async (
  backtrack: type.Backtrack
): Promise<void> => {
  try {
    await db.execute(
      "INSERT INTO backtrack (chordPattern, measures, bpm) VALUES (?, ?, ?)",
      [backtrack.chordPattern, backtrack.measures, backtrack.bpm]
    );
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        CommonError.DB_ERROR,
        "백킹트랙 저장에 실패했습니다.",
        500
      );
    }
  }
};
