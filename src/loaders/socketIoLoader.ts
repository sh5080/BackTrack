import { Server } from "socket.io";
import { Application } from "express";

export function socketIoLoader(app: Application): Server {
  const httpServer = app.listen(3000);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("chat message", (message) => {
      console.log(`Received message from client: ${message}`);
      io.emit("chat message", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
}
