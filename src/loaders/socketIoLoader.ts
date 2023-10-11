import { Server } from "socket.io";
import { Application } from "express";
import {
  createChatToRedis,
  getAllChatUsersFromRedis,
  redisClient,
  saveChatUserToRedis,
} from "../config/redis";

export function socketIoLoader(app: Application): Server {
  const httpServer = app.listen(3000);
  const io = new Server(httpServer, {
    cors: {
      origin: [
        process.env.FRONTEND_URL_1!,
        process.env.FRONTEND_URL_2!,
        process.env.FRONTEND_URL_3!,
      ],
      credentials: true,
    },
  });

  interface ActiveUsers extends Array<string> {}
  interface AllMessageData {
    messages: string[];
  }

  let activeUsers: ActiveUsers = [];
  const allMessageData: AllMessageData = { messages: [] };
  io.on("connection", (socket) => {
    console.log("SocketIO is connected");

    socket.emit("activeUsers", activeUsers);

    socket.on("chat", async (data) => {
      const { sender, receiver, message } = data;
      const messageData = { sender, receiver, message };
      const messageString = JSON.stringify(messageData);
      try {
        const chatKey1 = `${sender}_${receiver}`;
        const chatKey2 = `${receiver}_${sender}`;
        const [cursor1, keys1] = await redisClient.scan(
          0,
          "MATCH",
          `chat:*_${chatKey1}`
        );
        const [cursor2, keys2] = await redisClient.scan(
          0,
          "MATCH",
          `chat:*_${chatKey2}`
        );

        console.log("chatKey1: ", chatKey1);
        console.log("keys1: ", keys1);
        if (keys1.length > 0 || keys2.length > 0) {
          // 채팅방이 이미 존재하는 경우, 기존 채팅방에서 대화 내용 가져오기
          console.log("기존 채팅방 존재함");
          const chatKey = keys1.length > 0 ? keys1[0] : keys2[0]; // 첫 번째 매치된 채팅방 키 가져오기
          await redisClient.rpush(chatKey, messageString);
          const chatMessages = await redisClient.lrange(chatKey, 0, -1); // 모든 대화 내용 가져오기

          console.log("Chat messages:", chatMessages);
          allMessageData.messages = chatMessages;
        } else {
          // 채팅방이 존재하지 않는 경우, 새로운 채팅방 생성
          console.log("신규 채팅방 생성");
          await createChatToRedis(chatKey1, messageString, 30 * 24 * 60 * 60);
          await saveChatUserToRedis(chatKey1);
          console.log("New chat room created", chatKey1, ": ", messageString);
        }
      } catch (error) {
        console.error("Error saving message to Redis:", error);
      }
      const allUsername = await getAllChatUsersFromRedis();

      const exceptAdmin = allUsername.map((user) => user.split("_")[0]);
      console.log("exceptAdmin", exceptAdmin);
      activeUsers = exceptAdmin;
      io.to(data.sender).emit("chat", message);
      io.to(data.receiver).emit("chat", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");

      // const partner = activeUsers[socket.id];
      // if (partner) {
      //   activeUsers[socket.id] = null;
      //   activeUsers[partner] = null;
      // }
      // io.emit("activeUsers", activeUsers);
      // io.emit("messageData", allMessageData);

      console.log("activeUsers: ", activeUsers);
      io.emit("activeUsers", activeUsers);
      io.emit("messageData", allMessageData);
    });
  });

  return io;
}
