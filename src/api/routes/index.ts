import express from "express";
import backtrackRouter from "./backtrackRoutes";
import authRouter from "./authRoutes";
import oauthRouter from "./oauthRoutes";
import mypageRouter from "./mypageRoutes";
import chatRouter from "./chatRoutes";
import adminRouter from "./adminRoutes";
const router = express.Router();

router.use("/backtrack", backtrackRouter);
router.use("/auth", authRouter);
router.use("/oauth", oauthRouter);
router.use("/mypage", mypageRouter);
router.use("/chat", chatRouter);

router.use("/admin", adminRouter);
export default router;
