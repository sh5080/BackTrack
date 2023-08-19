import mysql, { Pool, createPool } from "mysql2/promise";
import config from "../config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import Redis from "ioredis";
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_SYNCRONIZE } =
  config.database;

export let db: Pool;
export let redisClient: Redis;
export const redisLoader = async () => {
  try {
    db = await createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
    });
    console.log("Cloud SQL server connection successful");

    redisClient = new Redis();
    console.log("Redis connection successful");

    return { db, redisClient };
  } catch (error) {
    console.error("Failed to establish connection:", error);
    throw error;
  }
};

export const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: 3306,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: Boolean(DB_SYNCRONIZE),
  logging: false,
  // entities: [AuthEntity],
  // entities: [__dirname + "/../models/entities/*.entity.{js,ts}"],
  entities: [
    "/Users/seunghwankim/myproject/intro-me/intro-me/jamTrack/src/models/entities/auth.entity.ts",
  ],

  migrations: [],
  subscribers: [],
});
// console.log(AppDataSource.options);

AppDataSource.initialize()
  .then(async () => {
    console.log("Connection initialized with database...");
  })
  .catch((error) => console.log(error));

export const getDataSource = (delay = 3000): Promise<DataSource> => {
  if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (AppDataSource.isInitialized) resolve(AppDataSource);
      else reject("Failed to create connection with database");
    }, delay);
  });
};
