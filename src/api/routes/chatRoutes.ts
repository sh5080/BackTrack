import { Router } from "express";
import * as chatController from "../../controllers/chatController";
import { validateToken } from "../middlewares/jwt";
import { ensureAdmin } from "../middlewares/admin";
import { Server } from "socket.io";

const router = Router();
export const io = new Server();

// [사용자] 채팅 생성
router.post("/user/chat", validateToken, chatController.createChatByUser);

// [어드민] 채팅 생성
router.post(
  "/admin/chat",
  validateToken,
  ensureAdmin,
  chatController.createChatByAdmin
);

// // [사용자] 채팅 조회
// router.get("/admin/chat", validateToken, chatController.getChatByAdmin);

// // [어드민] 채팅 조회
// router.get(
//   "/admin/chat",
//   validateToken,
//   ensureAdmin,
//   chatController.getChatByAdmin
// );

export default router;
