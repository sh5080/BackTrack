import { Response, NextFunction } from "express";
import { CustomRequest } from "../../types/customRequest";

export const ensureAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user === undefined) {
      throw Error;
    }
    const session = req.user;
    if (session?.role !== "ADMIN") {
      return res.status(403).json({ message: "관리자 권한이 없습니다." });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
