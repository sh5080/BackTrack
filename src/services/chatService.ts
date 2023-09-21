// import * as Type from "../types/type";
// import { saveChatToRedis } from "../config/redis"; // saveChatToRedis 함수 불러오기
// import { redisClient } from "../loaders/dbLoader";

// const MESSAGE_COUNTER_KEY = "chat_id_counter";

// export const createChat = async (
//   username: string,
//   message: string
// ): Promise<Type.ChatMessage> => {
//   try {
//     const chatId = await redisClient.incr(MESSAGE_COUNTER_KEY);
//     const chatIdWithUsername = `${chatId}_${username}`;
//     const newMessage: Type.ChatMessage = {
//       chat_id: chatIdWithUsername,
//       message,
//       created_at: new Date(),
//     };

//     const redisValue = JSON.stringify(newMessage);

//     // 채팅 데이터를 Redis에 저장
//     await saveChatToRedis(newMessage.chat_id, redisValue, 30 * 24 * 60 * 60);

//     return newMessage;
//   } catch (error) {
//     throw error;
//   }
// };
