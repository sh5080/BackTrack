import { NextFunction, Request, Response } from "express";
// import * as jamService from "../services/jamService";
// import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";
import * as jam from "../types/jam";
import { CommonError } from "../types/AppError";

/** jamTrack 생성 */
export const createChord = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { key, bpm } = req.body;

    return res.json();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 백킹트랙 생성 함수
function generateBackingTrack(key: string, measures: number): string[] {
  const backingTrack: string[] = [];
  const numChords = key.length;

  for (let i = 0; i < measures; i++) {
    const chordIndex = i % numChords;
    const chord = key[chordIndex];
    backingTrack.push(chord);
  }

  return backingTrack;
}

/** jamTrack 생성 */
export const createJamTrack = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { key, measures } = req.body;
    // 백킹트랙 생성
    const backingTrack = generateBackingTrack(key, measures);
    console.log(key);
    console.log(measures);
    return res.json({ backingTrack });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
