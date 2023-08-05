import { NextFunction, Request, Response } from "express";
// import * as jamService from "../services/jamService";
// import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";
import * as jam from "../types/jam";

// 백킹트랙 생성 함수
function generateBackingTrack(
  key: string,
  // beatsPerMeasure: number,
  // style: string,
  bpm: number
): jam.Note[] {
  const keyToScale: Record<string, string[]> = {
    C: ["C", "D", "E", "F", "G", "A", "B"],
    Db: ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"],
    D: ["D", "E", "F#", "G", "A", "B", "C#"],
    Eb: ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
    E: ["E", "F#", "G#", "A", "B", "C#", "D#"],
    F: ["F", "G", "A", "Bb", "C", "D", "E"],
    Gb: ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"],
    G: ["G", "A", "B", "C", "D", "E", "F#"],
    Ab: ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
    A: ["A", "B", "C#", "D", "E", "F#", "G#"],
    Bb: ["Bb", "C", "D", "Eb", "F", "G", "A"],
    B: ["B", "C#", "D#", "E", "F#", "G#", "A#"],
    // 샵(#)을 기준으로 음계 배열 추가
    "C#": ["C#", "D#", "E", "F#", "G#", "A", "B"],
    "D#": ["D#", "E#", "F#", "G#", "A#", "B", "C#"],
    "F#": ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
    "G#": ["G#", "A#", "B#", "C#", "D#", "E#", "F#"],
    "A#": ["A#", "B#", "C#", "D#", "E#", "F#", "G#"],
  };

  // 스타일에 따른 리듬 패턴 및 화음 선택
  // const styleToRhythm: Record<string, number[]> = {
  //   pop: [2, 2, 4, 2],
  //   rock: [4, 4, 2, 2],
  // };

  // 박자당 시간 계산
  const timePerBeat = 60 / bpm;

  // 백킹트랙 생성
  const backingTrack: jam.Note[] = [];
  const scale = keyToScale[key];

  // const rhythmPattern = styleToRhythm[style];
  let currentBeat = 0;

  // for (const rhythm of rhythmPattern) {
  const chordIndex = currentBeat % scale.length;
  const note: jam.Note = {
    pitch: scale[chordIndex],
    // duration: rhythm * beatsPerMeasure * timePerBeat,
  };
  backingTrack.push(note);
  // currentBeat += rhythm;
  // }

  return backingTrack;
}

/** jamTrack 생성 */
export const createJamTrack = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      key,
      beatsPerMeasure,
      // style,
      bpm,
    } = req.body;

    // 백킹트랙 생성
    const backingTrack = generateBackingTrack(
      key,
      // beatsPerMeasure,
      // style,
      bpm
    );
    console.log(backingTrack);
    return res.json({ backingTrack });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
