import { NextFunction, Request, Response } from "express";
import * as backtrackService from "../services/backtrackService";
import { AppError, CommonError } from "../types/AppError";
import { CustomRequest } from "../types/customRequest";

/** Backtrack 생성 */
export const createBacktrack = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, backtrack } = req.body;
    const username = req.user!.username;
    console.log("backtrack: ", backtrack);

    if (title.length > 30) {
      throw new AppError(
        CommonError.INVALID_INPUT,
        "제목은 30자 이내로 작성 가능합니다.",
        400
      );
    }

    const backtrackData = await backtrackService.createBacktrack(
      username,
      title,
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

export const getBacktrackPage = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.user!.username;
    const page = await backtrackService.getBacktrackPage(username);
    res.json(page);
  } catch (error) {
    next(error);
  }
};
