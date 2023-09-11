import { Server } from "socket.io";
import { Application } from "express";
import { createChatToRedis, redisClient } from "../config/redis";

export function socketIoLoader(app: Application): Server {
  const httpServer = app.listen(3000);
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:8080"],
      credentials: true,
    },
  });
  interface ActiveUsers {
    [userId: string]: string | null;
  }

  const activeUsers: ActiveUsers = {};

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
          `chat:*_${receiver}`
        );
        const [cursor2, keys2] = await redisClient.scan(
          0,
          "MATCH",
          `chat:*_${sender}`
        );

        console.log("chatKey1: ", chatKey1);
        console.log("keys1: ", keys1);
        if (keys1.length > 0 || keys2.length > 0) {
          // 채팅방이 이미 존재하는 경우, 기존 채팅방에 메시지 추가
          console.log("기존 채팅방 존재함");
          const chatKey = keys1.length > 0 ? chatKey1 : chatKey2;
          await redisClient.rpush(chatKey, messageString);
          console.log(
            "Message added to existing chat room",
            chatKey,
            ": ",
            message
          );
        } else {
          // 채팅방이 존재하지 않는 경우, 새로운 채팅방 생성
          console.log("신규 채팅방 생성");
          await createChatToRedis(chatKey1, messageString, 30 * 24 * 60 * 60);
          console.log("New chat room created", chatKey1, ": ", messageString);
        }
      } catch (error) {
        console.error("Error saving message to Redis:", error);
      }

      activeUsers["originSender"] = sender;
      activeUsers["originReceiver"] = receiver;

      io.to(data.sender).emit("chat", message);
      io.to(data.receiver).emit("chat", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");

      const partner = activeUsers[socket.id];
      if (partner) {
        activeUsers[socket.id] = null;
        activeUsers[partner] = null;
      }
      io.emit("activeUsers", activeUsers);
    });
  });

  return io;
}
