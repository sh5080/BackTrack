import { NextFunction, Request, Response } from "express";
// import * as jamService from "../services/jamService";
import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";
import * as Tone from "tone";

// 백킹트랙 생성 함수
function generateBackingTrack(
  chordPattern: string,
  measures: number
): string[] {
  const backingTrack: string[] = [];
  const numChords = chordPattern.length;

  for (let i = 0; i < measures; i++) {
    const chordIndex = i % numChords;
    const chord = chordPattern[chordIndex];
    backingTrack.push(chord);
  }
  console.log(backingTrack);
  return backingTrack;
}

/** jamTrack 생성 */
export const createBacktrack = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chordPattern, bpm, measures } = req.body;
    console.log("bpm: ", bpm);
    console.log("chord: ", chordPattern);

    const numChords = chordPattern.length;
    console.log("num: ", numChords);
    if (numChords > measures) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "등록한 코드가 마디수보다 많습니다. 마디수를 늘려주세요.",
        400
      );
    }
    if (numChords === 0) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "최소 하나의 코드를 등록해주세요.",
        400
      );
    }
    // 백킹트랙 생성
    const backingTrack = generateBackingTrack(chordPattern, measures);

    return res.json({ backingTrack });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// const synth = new Tone.Synth().toDestination();
// synth.triggerAttackRelease("C4", "8n");
