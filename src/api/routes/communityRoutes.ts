import { Router } from "express";
import * as communityController from "../../controllers/communityController";
import { validateRequestBody } from "../middlewares/validateRequest";
import { validateToken } from "../middlewares/jwt";
const router = Router();

/** 커뮤니티 게시글 업로드 */
router.post(
  "/",
  validateToken,
  validateRequestBody(["title", "description"]),
  communityController.createCommunity
);

/** 커뮤니티 게시글 특정 조회 */
router.get("/:id", communityController.getOneCommunity);

/** 커뮤니티 게시글 전체 조회 (페이지네이션) */
router.get("/", communityController.getCommunity);

/** 커뮤니티 게시글 수정 */
// router.patch("/", validateToken, communityController.updateCommunity);

/** 커뮤니티 게시글 삭제 */
// router.delete("/", validateToken, communityController.deleteCommunity);

export default router;
