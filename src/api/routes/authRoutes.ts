import { Router } from "express";
import * as authController from "../../controllers/authController";
import { validateRequestBody } from "../middlewares/validateRequest";

const router = Router();

/** 회원가입 */
router.post(
  "/signup",
  validateRequestBody(["username", "email", "password"]),
  authController.signup
);
/** [인증] 로그인 */
router.post(
  "/login",
  validateRequestBody(["username", "password"]),
  authController.login
);

/** [인증] 로그아웃 */
router.post("/logout", authController.logout);

export default router;
