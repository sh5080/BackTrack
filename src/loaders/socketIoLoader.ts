import { Server } from "socket.io";
import { Application } from "express";
import { saveChatToRedis, redisClient } from "../config/redis";

const MESSAGE_COUNTER_KEY = "chat_id_counter";
export function socketIoLoader(app: Application): Server {
  const httpServer = app.listen(3000);
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:8080"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("SocketIO is connected");

    socket.on("chat", async (data) => {
      const { nickname, message } = data;
      console.log(`Received message from ${nickname}: ${message}`);

      try {
        const chatId = await redisClient.incr(MESSAGE_COUNTER_KEY);
        const chatIdWithNickname = `${chatId}_${nickname}`;

        await saveChatToRedis(chatIdWithNickname, message, 30 * 24 * 60 * 60); //30일
        console.log(
          "Redis saved successful ",
          chatIdWithNickname,
          ": ",
          message
        );
      } catch (error) {
        console.error("Error saving message to Redis:", error);
      }

      io.emit("chat", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
}
