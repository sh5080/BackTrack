import io from "socket.io-client";

const socket = io("http://localhost:3000");

export const SocketPlugin = {
  install(app) {
    app.provide("join", ($payload) => {
      socket.emit("join", $payload);
    });

    app.provide("leave", ($payload) => {
      socket.emit("leave", $payload);
    });

    app.provide("sendMessage", ($payload) => {
      socket.emit("chat", {
        message: $payload.message,
        nickname: $payload.nickname,
      });
    });

    app.provide("socket", socket);
  },
};

// Vue.use(SocketPlugin);
