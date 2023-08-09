import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface CustomRequest extends Request {
  user?: JwtPayload & { username: string; role: string };
  body: {
    username: string;
    email: string;
    password: string;
    chordPattern: string;
    measures: number;
    bpm: number;
  };
}
