import { Router } from "express";
import * as postController from "../../controllers/postController";
import { validateRequestBody } from "../middlewares/validateRequest";
import { validateToken } from "../middlewares/jwt";
import transactionMiddleware from "../middlewares/transactionHandler";
const router = Router();

/** 게시글 업로드 */
router.post("/", validateToken, postController.createPost);

/** 게시글 전체 조회 (페이지네이션) */
router.get("/", postController.getPost);

/** 게시글 특정 조회 */
router.get("/:id", postController.getOnePost);

/** 게시글 수정 */
// router.patch("/", validateToken, postController.updatePost);

/** 게시글 삭제 */
router.delete("/", validateToken, postController.deletePost);

/** 좋아요 추가 */
router.post("/like", validateToken, postController.addLikeToPost);

/** 좋아요 취소 */
router.delete(
  "/like/:postId",
  validateToken,
  postController.removeLikeFromPost
);

export default router;
