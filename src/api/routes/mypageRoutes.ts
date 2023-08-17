import { Router } from "express";
import * as mypageController from "../../controllers/mypageController";
import { validateToken } from "../middlewares/jwt";

const router = Router();

// /** [마이페이지] 회원정보 조회 */
router.get("/userInfo", validateToken, mypageController.getUserInfo);

export default router;
