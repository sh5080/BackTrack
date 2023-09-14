import { Router } from "express";
import * as backtrackController from "../../controllers/backtrackController";
import { validateRequestBody } from "../middlewares/validateRequest";
import { validateToken } from "../middlewares/jwt";

const router = Router();

/** 백킹트랙 생성 */
router.post(
  "/",
  validateToken,
  // validateRequestBody(["bpm", "measures", "chordPattern"]),
  backtrackController.createBacktrack
);

router.get("/", validateToken, backtrackController.getBacktrack);

router.get("/page", validateToken, backtrackController.getBacktrackPage);

router.get("/data", validateToken, backtrackController.getAllBacktrackData);

router.patch("/update", validateToken, backtrackController.updateBacktrack);

export default router;
