import { Router } from "express";
import * as mypageController from "../../controllers/mypageController";
import { validateToken } from "../middlewares/jwt";
import { validateRequestBody } from "../middlewares/validateRequest";
const router = Router();

// /** [마이페이지] 회원정보 조회 */
router.get("/userInfo", validateToken, mypageController.getUserInfo);

/** [사용자] 닉네임 변경 */
router.put(
  "/userInfo/nickname",
  validateToken,
  validateRequestBody(["nickname"]),
  mypageController.updateUserInfo
);
/** [사용자] 이메일 변경 */
router.put(
  "/userInfo/email",
  validateToken,
  validateRequestBody(["email"]),
  mypageController.updateUserInfo
);
/** [사용자] 비밀번호 변경 */
router.put(
  "/userInfo/password",
  validateToken,
  validateRequestBody(["password", "newPassword", "newPasswordConfirm"]),
  mypageController.updatePassword
);

export default router;
