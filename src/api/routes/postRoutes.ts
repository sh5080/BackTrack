import { Router } from "express";
import * as postController from "../../controllers/postController";
import { validateRequestBody } from "../middlewares/validateRequest";
import { validateToken } from "../middlewares/jwt";

const router = Router();

/** 게시글 업로드 */
router.post("/", validateToken, postController.createPost);

/** 게시글 수정 */
// router.patch("/", validateToken, postController.updatePost);

export default router;
