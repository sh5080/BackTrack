import express from "express";
import backtrackRouter from "./backtrackRoutes";
import postRouter from "./postRoutes";
import communityRouter from "./communityRoutes";
import authRouter from "./authRoutes";
import oauthRouter from "./oauthRoutes";
import mypageRouter from "./mypageRoutes";
import commentRouter from "./commentRoutes";
// import chatRouter from "./chatRoutes";
import adminRouter from "./adminRoutes";
const router = express.Router();

router.use("/auth", authRouter);
router.use("/oauth", oauthRouter);
router.use("/mypage", mypageRouter);
router.use("/backtrack", backtrackRouter);
router.use("/post", postRouter);
router.use("/community", communityRouter);
router.use("/comment", commentRouter);
// router.use("/chat", chatRouter);

router.use("/admin", adminRouter);
export default router;
