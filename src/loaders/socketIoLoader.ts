import { Server } from "socket.io";
import { Application } from "express";
import { saveChatToRedis, redisClient } from "../config/redis";

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
      try {
        const chatKey = `${sender}_${receiver}`;
        await saveChatToRedis(chatKey, message, 30 * 24 * 60 * 60);
        console.log("Redis saved successful ", chatKey, ": ", message);
      } catch (error) {
        console.error("Error saving message to Redis:", error);
      }

      activeUsers[sender] = receiver;
      activeUsers[receiver] = sender;

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
