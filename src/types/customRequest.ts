import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface CustomRequest extends Request {
  user?: JwtPayload & { username: string; role: string };
  body: {
    username: string;
    email: string;
    password: string;
    newPassword: string;
    newPasswordConfirm: string;

    title: string;
    bpm: number;
    backtrack: string[][][];
    description: string;
    nickname: string;
    image: string;
    message: string;

    postId: number;
    userId: number;
    comment: string;
  };
  query: {
    page: string;
    username: string;
    code: string;
    nickname: string;
    id: string;
    backtrackId: string;
  };
}
