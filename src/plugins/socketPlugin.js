// import Vue from "vue";
import io from "socket.io-client";

const socket = io("http://localhost:3000");
console.log("과연: ", socket);
export const SocketPlugin = {
  install(app) {
    app.provide("join", ($payload) => {
      console.log("Joining with payload:", $payload);
      socket.emit("join", $payload);
    });

    app.provide("leave", ($payload) => {
      console.log("Leaving with payload:", $payload);
      socket.emit("leave", $payload);
    });

    app.provide("sendMessage", ($payload) => {
      console.log("Sending message with payload:", $payload);
      socket.emit("chat", {
        message: $payload.message,
        name: $payload.name,
        avatar: $payload.avatar,
      });
    });

    app.provide("socket", socket);
  },
};

// Vue.use(SocketPlugin);
