import express from "express";
import jamRouter from "./jamRoutes";

const router = express.Router();

router.use("/jam", jamRouter);

export default router;
