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
/** 백킹트랙 조회 */
router.get("/", validateToken, backtrackController.getMyBacktrack);

/** 백킹트랙 특정 조회 */
router.get("/detail", backtrackController.getBacktrackDetail);

/** 백킹트랙 삭제 */
router.delete("/", validateToken, backtrackController.deleteBacktrack);
export default router;
