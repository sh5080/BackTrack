import { NextFunction, Request, Response } from "express";
import * as backtrackService from "../services/backtrackService";
import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";
import fs from "fs";
import path from "path";
import * as Type from "../types/type";

/** Backtrack 생성 */
export const createBacktrack = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { backtrack } = req.body;
    const username = req.user!.username;
    console.log("backtrack: ", backtrack);

    const backtrackData = await backtrackService.createBacktrack(
      username,
      backtrack
    );

    res.json({ message: "악보 저장이 완료되었습니다.", backtrackData });
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
    const username = req.user!.username;
    const page = req.query.page;

    const backtrackData = await backtrackService.getBacktrack(
      username,
      parseInt(page)
    );
    res.json({ message: "악보 불러오기가 완료되었습니다.", backtrackData });
  } catch (error) {
    next(error);
  }
};
