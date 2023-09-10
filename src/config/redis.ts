import Redis from "ioredis";
import { promisify } from "util";
import { AppError, CommonError } from "../types/AppError";

export const redisClient = Redis.createClient();

const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);

export const saveSessionToRedis = async (
  username: string,
  nickname: string,
  refreshToken: string,
  maxAge: number
) => {
  const currentTime = new Date();
  const koreanTimeOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
  const koreanTime = new Date(currentTime.getTime() + koreanTimeOffset);

  const sessionStart = koreanTime.toISOString();
  const sessionExpire = new Date(koreanTime.getTime() + maxAge);

  const sessionData = JSON.stringify({
    nickname: nickname,
    refreshToken: refreshToken,
    session_start_time: sessionStart,
    session_expire_time: sessionExpire,
  });
  const key = `session:${username}`;
  await redisClient.set(key, sessionData, "EX", maxAge);
};

export const getSessionFromRedis = async (username: string) => {
  const sessionData = await getAsync(`session:${username}`);

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
const MESSAGE_COUNTER_KEY = "chat_id_counter";
export const saveChatToRedis = async (
  roomName: string,
  messageData: string,
  expirationInSeconds: number
) => {
  const chatId = await redisClient.incr(MESSAGE_COUNTER_KEY);
  const chatKey = `chat:${chatId}_${roomName}`;
  await redisClient.rpush(chatKey, messageData);
  await redisClient.expire(chatKey, expirationInSeconds);
};

export const getChatFromRedis = async (messageId: string) => {
  const chatData = await getAsync(`chat:${messageId}`);
  return chatData;
};
