import multer from "multer";
import * as fs from "node:fs";

import { Request, Response, NextFunction } from "express";
import * as crypto from "node:crypto";

if (!fs.existsSync("public")) {
  fs.mkdirSync("public");
}
if (!fs.existsSync("public/compressed")) {
  fs.mkdirSync("public/compressed");
}

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, "./public");
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    cb(null, crypto.randomUUID() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 }, // 1MB 이하 파일만 허용 (원하는 크기로 조정)
}).single("image");

export const processImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // multer 미들웨어를 라우터 핸들러 함수 내에서 호출
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      return next(err); // 에러를 다음 미들웨어로 전달
    }
    const file = req.file as Express.Multer.File;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    // 업로드된 파일의 정보를 활용하여 추가 작업 수행
    console.log("Uploaded file:", file.filename);
    next();
  });
};
