import express from "express";
import backtrackRouter from "./backtrackRoutes";
import authRouter from "./authRoutes";

const router = express.Router();

router.use("/backtrack", backtrackRouter);
router.use("/auth", authRouter);

export default router;
