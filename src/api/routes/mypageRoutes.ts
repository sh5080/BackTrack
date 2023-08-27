import { Router } from "express";
import * as mypageController from "../../controllers/mypageController";
import { validateToken } from "../middlewares/jwt";
import { validateRequestBody } from "../middlewares/validateRequest";
const router = Router();

// /** [마이페이지] 회원정보 조회 */
router.get("/userInfo", validateToken, mypageController.getUserInfo);

// /** [마이페이지] 회원정보 수정 */
router.patch("/userInfo", validateToken, mypageController.updateUserInfo);

/** [사용자] 닉네임 재설정 */
router.put(
  "/userInfo/nickname",
  validateToken,
  validateRequestBody(["nickname"]),
  mypageController.updateUserInfo
);

export default router;
