import { Router } from "express";
import * as adminController from "../../controllers/adminController";
import { validateToken } from "../middlewares/jwt";

const router = Router();

// /** [마이페이지] 회원정보 조회 */
router.get("/categories", validateToken, adminController.createCategory);

export default router;
