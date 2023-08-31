import { NextFunction, Request, Response } from "express";
import * as backtrackService from "../services/backtrackService";
import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";
import fs from "fs";
import path from "path";

// 백킹트랙 생성 함수
function convertChordToAbc(chordData: string[][][]) {
  const abcContent = chordData
    .map(
      (measureChords) =>
        `| ${measureChords
          .map((chords) =>
            chords.map((chord) => `'${chord.replace(/'|\s/g, "")}'`).join("")
          )
          .join(" | ")} |`
    )
    .join("\n");

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

    fs.writeFileSync(filePath, abcContent);

    res.json({ filePath });
  } catch (error) {
    next(error);
  }
};

export const getBacktrack = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const fileName = req.query.filePath;
    // const filePath = path.join(__dirname, "../..", "uploads", fileName);
    console.log("여기: ", fileName);
    fs.readFile(fileName, (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        res.status(500).json({ error: "Failed to read file" });
      } else {
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${fileName}`
        );
        res.setHeader("Content-Type", "application/octet-stream");
        res.send(data);
      }
    });
  } catch (error) {
    next(error);
  }
};

// const synth = new Tone.Synth().toDestination();
// synth.triggerAttackRelease("C4", "8n");
