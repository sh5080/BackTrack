import { Router } from "express";
import * as adminController from "../../controllers/adminController";
import { validateToken } from "../middlewares/jwt";
import { ensureAdmin } from "../middlewares/admin";
const router = Router();

// /** [어드민] 카테고리 생성 */
router.get(
  "/categories",
  ensureAdmin,
  validateToken,
  adminController.createCategory
);

export default router;
