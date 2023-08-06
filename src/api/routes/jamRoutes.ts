import { Router } from "express";
import * as jamController from "../../controllers/jamController";
import { validateRequestBody } from "../middlewares/validateRequest";

const router = Router();

/** open AI 프롬프트 json에 저장 */
router.post(
  "/",
  validateRequestBody(["key", "measures"]),
  jamController.createJamTrack
);

export default router;
