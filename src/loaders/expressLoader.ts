import express, { Application } from "express";
import { AppDataSource } from "../loaders/dbLoader";
import cors from "cors";
import { redisLoader } from "../loaders/dbLoader";
import { socketIoLoader } from "./socketIoLoader";
import routeLoader from "./routeLoader";
import { errorHandler } from "../api/middlewares/errorHandler";
import responseTime from "../api/middlewares/responseTime";
import path from "path";
export default async function expressLoader(
  app: Application
): Promise<Application> {
  try {
    const redisClient = await redisLoader();
    const io = socketIoLoader(app);
    const corsOptions = {
      origin: [
        process.env.FRONTEND_URL_1!,
        process.env.FRONTEND_URL_2!,
        process.env.FRONTEND_URL_3!,
      ],
      credentials: true,
    };

    app.use(responseTime);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(cors(corsOptions));

    app.locals.redisClient = redisClient;
    app.set("connection", AppDataSource);

    routeLoader(app);
    app.use(errorHandler);

    return app;
  } catch (error) {
    console.error(
      "Error occurred during Express loader initialization:",
      error
    );
    throw error;
  }
}
