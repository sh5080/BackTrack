import { Router } from "express";
import * as adminController from "../../controllers/adminController";
import { validateToken } from "../middlewares/jwt";
import { ensureAdmin } from "../middlewares/admin";
import { processImage } from "../middlewares/multer";
const router = Router();

// /** [어드민] 팝업 생성 */
router.post(
  "/popup",
  validateToken,
  ensureAdmin,
  processImage,
  adminController.createPopup
);

export default router;
