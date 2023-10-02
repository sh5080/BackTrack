import io from "socket.io-client";

const socket = io("http://localhost:3000");

export const SocketPlugin = {
  install(app) {
    app.provide("sendMessage", ($payload) => {
      socket.emit("chat", {
        sender: $payload.sender,
        receiver: $payload.receiver,
        message: $payload.message,
        // isAdmin: $payload.isAdmin,
      });
    });

    app.provide("socket", socket);
  },
};
