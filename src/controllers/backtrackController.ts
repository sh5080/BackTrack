import { NextFunction, Request, Response } from "express";
import * as backtrackService from "../services/backtrackService";
import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";
import fs from "fs";
import path from "path";

// 백킹트랙 생성 함수
function convertChordToAbc(chordData: string[][][]) {
  const abcContent = chordData
    .map((measure) => measure.map((chords) => chords.join(" ")).join(" | "))
    .join(" | ");

  return `X:1\nT:Generated Backtrack\nM:4/4\nK:C\n${abcContent}`;
}

/** Backtrack 생성 */
export const createBacktrack = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chord } = req.body;
    console.log("chord: ", chord);

    const abcContent = convertChordToAbc(chord);

    const currentDate = new Date();
    const koreaTime = new Date(currentDate.getTime());

    const year = koreaTime.getFullYear();
    const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
    const day = String(koreaTime.getDate()).padStart(2, "0");
    const hours = String(koreaTime.getHours()).padStart(2, "0");
    const minutes = String(koreaTime.getMinutes()).padStart(2, "0");
    const seconds = String(koreaTime.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;
    const fileName = `${formattedDate}-backtrack.abc`;

    const filePath = path.join(__dirname, "../..", "uploads", fileName);

    console.log("1: ", __dirname);
    console.log("filePath: ", filePath);
    // Write the .abc content to the file
    fs.writeFileSync(filePath, abcContent);

    // Send the file path to the client
    res.json({ filePath });
  } catch (error) {
    next(error);
  }
};

// export const saveBacktrack = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { chord, bpm, measures } = req.body;

//     const backtrackData = { chord, bpm, measures };
//     await backtrackService.saveBacktrack(backtrackData);
//     return res.status(200).json({ message: "백킹트랙 저장에 성공했습니다." });
//   } catch (error) {
//     next(error);
//   }
// };

// const synth = new Tone.Synth().toDestination();
// synth.triggerAttackRelease("C4", "8n");
