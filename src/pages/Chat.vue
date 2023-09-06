<template>
  <div class="chat">
    <div class="chat__header">
      <span class="chat__header__greetings">
        안녕하세요. {{ userData }}님!
      </span>
    </div>
    <chat-list :msgs="msgData"></chat-list>
    <chat-form @submitMessage="sendMessage"></chat-form>
  </div>
</template>

<script>
import { computed, onMounted, onBeforeUnmount } from "vue";
import ChatList from "../components/ChatPlugin/ChatList.vue";
import ChatForm from "../components/ChatPlugin/ChatForm.vue";
import Constant from "../constant";
import { useStore } from "vuex";
import io from "socket.io-client";

export default {
  setup() {
    const store = useStore();
    const userData = computed(() => store.state.loggedInNickname);
    const msgData = computed(() => store.state.socket.msgData);

    const pushMsgData = (data) => {
      store.commit(Constant.PUSH_MSG_DATA, data);
    };

    const sendMessage = (msg) => {
      const username = userData.value.userName;
      const avatar = userData.value.userImage;

      pushMsgData({
        from: {
          name: "prpn97",
          avatar: avatar,
        },
        msg,
      });

      const socket = io("http://localhost:3000");

      socket.emit("chat", {
        name: username,
        msg,
        avatar: avatar,
      });

      setTimeout(() => {
        const element = document.getElementById("chat__body");
        element.scrollTop = element.scrollHeight;
      }, 0);
    };

    onMounted(() => {
      const socket = io("http://localhost:3000");
      socket.on("chat", (data) => {
        pushMsgData(data);

        setTimeout(() => {
          const element = document.getElementById("chat__body");
          element.scrollTop = element.scrollHeight;
        }, 0);
      });
    });

    onBeforeUnmount(() => {
      // 컴포넌트 해제 시 처리할 내용을 추가할 수 있습니다.
    });

    return {
      userData,
      msgData,
      sendMessage,
    };
  },
  components: {
    ChatList,
    ChatForm,
  },
};
</script>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 1800px;
  height: 2000px;
  top: auto;
  left: auto;
  bottom: 0;
  right: 0;
  position: fixed;
  background: #ffffff;
}

.chat__header {
  background: #ffffff;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.05);
  border-radius: 24px 24px 0px 0px;
  padding: 1.8rem;
  font-size: 60px;
  font-weight: 700;
}

.chat__header__greetings {
  color: #292929;
}
</style>
