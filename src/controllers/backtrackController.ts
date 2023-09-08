import { NextFunction, Request, Response } from "express";
import * as backtrackService from "../services/backtrackService";
import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";
import fs from "fs";
import path from "path";

/** Backtrack 생성 */
export const createBacktrack = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chords } = req.body;
    console.log("chords: ", chords);

    const newUser = await backtrackService.createBacktrack({
      username,
      chords,
    });

    res.json({ message: "악보 저장이 완료되었습니다.", chords });
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
