import Redis from "ioredis";
import { promisify } from "util";

const redisClient = Redis.createClient();

const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);

export const saveSessionToRedis = async (userId: number, maxAge: number) => {
  const currentTime = new Date();
  const sessionStart = currentTime.toISOString();
  const sessionExpire = new Date(currentTime.getTime() + maxAge).toISOString();

  const sessionData = JSON.stringify({
    user_id: userId,
    session_start_time: sessionStart,
    session_expire_time: sessionExpire,
  });

  await setAsync(`session:${userId}`, sessionData);
  // 여기서 `session:${userId}`는 각 사용자의 세션 키입니다.
};

export const getSessionFromRedis = async (userId: number) => {
  const sessionData = await getAsync(`session:${userId}`);

  if (sessionData) {
    return JSON.parse(sessionData);
  } else {
    return null;
  }
};
