import { Router } from "express";
import * as postController from "../../controllers/postController";
import { validateRequestBody } from "../middlewares/validateRequest";
import { validateToken } from "../middlewares/jwt";

const router = Router();

/** 게시글 업로드 */
router.post("/", validateToken, postController.createPost);

/** 게시글 전체 조회 */
router.get("/", postController.getPost);

/** 게시글 수정 */
// router.patch("/", validateToken, postController.updatePost);

/** 게시글 삭제 */
router.delete("/", validateToken, postController.deletePost);
export default router;
