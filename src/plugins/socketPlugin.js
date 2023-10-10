import io from "socket.io-client";
const serverUrl = process.env.VUE_APP_SOCKET_URL;
const socket = io(`${serverUrl}`);

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
