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
router.get("/", validateToken, backtrackController.getBacktrack);
/** 백킹트랙 페이지 조회 */
router.get("/page", validateToken, backtrackController.getBacktrackPage);

router.get("/data", validateToken, backtrackController.getAllBacktrackData);

/** 백킹트랙 삭제 */
router.delete("/", validateToken, backtrackController.deleteBacktrack);
export default router;
