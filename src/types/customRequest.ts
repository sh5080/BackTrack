// import { JwtPayload } from 'jsonwebtoken';
import { Request } from "express";

export interface CustomRequest extends Request {
  body: {
    chordPattern: string;
    measures: number;
    bpm: number;
  };
}
