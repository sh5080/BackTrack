import { Router } from "express";
import * as jamController from "../../controllers/backtrackController";
import { validateRequestBody } from "../middlewares/validateRequest";

const router = Router();

/** 백킹트랙 생성 */
router.post(
  "/",
  validateRequestBody(["bpm", "measures", "chordPattern"]),
  jamController.createBacktrack
);

export default router;
