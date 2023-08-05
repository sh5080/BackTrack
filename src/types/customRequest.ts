// import { JwtPayload } from 'jsonwebtoken';
import { Request } from "express";

export interface CustomRequest extends Request {
  body: {
    key: string;
    beatsPerMeasure: number;
    style: string;
    bpm: number;
  };
}
