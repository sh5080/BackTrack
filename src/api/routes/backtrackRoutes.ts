import { Router } from "express";
import * as jamController from "../../controllers/backtrackController";
import { validateRequestBody } from "../middlewares/validateRequest";
import { validateToken } from "../middlewares/jwt";

const router = Router();

/** 백킹트랙 생성 */
router.post(
  "/",
  validateRequestBody(["bpm", "measures", "chordPattern"]),
  jamController.createBacktrack
);

router.post(
  "/save",
  validateToken,
  validateRequestBody(["backtrack"]),
  jamController.saveBacktrack
);

export default router;
