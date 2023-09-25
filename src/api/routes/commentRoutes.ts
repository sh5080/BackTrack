import { Router } from "express";
import { validateToken } from "../middlewares/jwt";
import * as commentController from "../../controllers/commentController";
import { validateRequestBody } from "../middlewares/validateRequest";
const router = Router();

/** [댓글] 댓글 생성 */
router.post(
  "/",
  validateToken,
  validateRequestBody(["id", "comment", "option"]),
  commentController.createComment
);

/** [댓글] post 댓글 조회 */
router.get("/post/:postId", commentController.getPostCommentsByPostId);

/** [댓글] post 댓글 조회 */
router.get(
  "/community/:communityId",
  commentController.getCommunityCommentsByCommunityId
);

// /** [댓글] 댓글 수정 */
// router.put(
//   "/:commentId",
//   validateToken,
//   validateRequestBody(["comment"]),
//   commentController.updateComment
// );

// /** [댓글] 댓글 삭제 */
// router.delete("/:commentId", validateToken, commentController.deleteComment);

export default router;
