import { Router } from "express";
import * as backtrackController from "../../controllers/backtrackController";
import { validateRequestBody } from "../middlewares/validateRequest";
import { validateToken } from "../middlewares/jwt";

const router = Router();

/** 백킹트랙 생성 */
router.post(
  "/",
  // validateRequestBody(["bpm", "measures", "chordPattern"]),
  backtrackController.createBacktrack
);

router.get("/:fileName", backtrackController.getBacktrack);

export default router;
