import Redis from "ioredis";
import { promisify } from "util";
import { AppError, CommonError } from "../types/AppError";

const redisClient = Redis.createClient();

const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);

export const saveSessionToRedis = async (userId: number, maxAge: number) => {
  const currentTime = new Date();
  const koreanTimeOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
  const koreanTime = new Date(currentTime.getTime() + koreanTimeOffset);

  const sessionStart = koreanTime.toISOString();
  const sessionExpire = new Date(koreanTime.getTime() + maxAge);

  const sessionData = JSON.stringify({
    user_id: userId,
    session_start_time: sessionStart,
    session_expire_time: sessionExpire,
  });

  await redisClient.set(`session:${userId}`, sessionData, "EX", maxAge);
};

export const getSessionFromRedis = async (userId: number) => {
  const sessionData = await getAsync(`session:${userId}`);

  if (sessionData) {
    return JSON.parse(sessionData);
  } else {
    throw new AppError(
      CommonError.TOKEN_EXPIRED_ERROR,
      "세션이 만료되었거나 유효하지 않은 세션입니다. 다시 로그인해주세요.",
      401
    );
  }
};
