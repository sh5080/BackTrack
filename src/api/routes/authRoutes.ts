import { Router } from "express";
import * as authController from "../../controllers/authController";
import { validateRequestBody } from "../middlewares/validateRequest";

const router = Router();

/** 회원가입 */
router.post(
  "/",
  validateRequestBody(["username", "email", "password"]),
  authController.signup
);

export default router;
