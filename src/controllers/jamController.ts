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
function generateBackingTrack(key: string, bpm: number) {
  const scale: string[] = [key];
  console.log(scale);
  // 박자당 시간 계산
  const timePerBeat = 60 / bpm;

  // 백킹트랙 생성
  const backingTrack = [];

  backingTrack.push(key);

  return backingTrack;
}

/** jamTrack 생성 */
export const createJamTrack = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { key, bpm } = req.body;
    console.log(key);
    // 백킹트랙 생성
    const backingTrack = generateBackingTrack(key, bpm);
    console.log(backingTrack);
    return res.json({ backingTrack });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
