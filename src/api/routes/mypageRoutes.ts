import { Router } from "express";
import * as mypageController from "../../controllers/mypageController";
import { validateRequestBody } from "../middlewares/validateRequest";

const router = Router();

// /** [마이페이지] 회원정보 조회 */
router.get(
  "/userInfo",
  validateRequestBody(["username"]),
  mypageController.getUserInfo
);

export default router;
