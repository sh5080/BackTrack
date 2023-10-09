import express, { Application, Request, Response } from "express";
import router from "../api/routes/index";
import path from "path";
import history from "connect-history-api-fallback";
const routeLoader = (app: Application): Application => {
  app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    console.log("여기: ", path.resolve(__dirname, "dist", "index.html"));
  });

  app.use(history());
  /** 정적 파일 경로 */
  app.use("/static", express.static("public"));

  /** 라우팅 */
  app.use("/api", router);
  return app;
};

export default routeLoader;
