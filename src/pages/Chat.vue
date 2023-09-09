<template>
  <div class="chat">
    <div class="chat__header">
      <span class="chat__header__greetings">
        안녕하세요. {{ nickname }}님!
      </span>
      <v-col cols="auto">
        <v-btn
          style="color: #999999; transform: rotate(45deg)"
          tonal
          density="compact"
          icon="mdi-plus"
          size="medium"
          @click="hideChat"
        ></v-btn>
      </v-col>
    </div>
    <chat-list :messages="messageData"></chat-list>
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
  methods: {
    hideChat() {
      this.$emit("hide-chat");
    },
  },
  setup() {
    const store = useStore();
    const nickname = computed(() => store.state.loggedInNickname);
    const messageData = computed(() => store.state.socket.messageData);

    const pushmessageData = (data) => {
      store.commit(Constant.PUSH_message_DATA, data);
    };
    const socket = io("http://localhost:3000");
    const sendMessage = async (message) => {
      pushmessageData({
        nickname: nickname.value,

        message,
      });

      socket.emit("chat", {
        nickname: nickname.value,
        message,
      });
    };

    onMounted(() => {
      socket.on("chat", (data) => {
        pushmessageData(data);

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
      nickname,
      messageData,
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
  z-index: 999;
}

.chat__header {
  background: #ffffff;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.05);
  border-radius: 24px 24px 0px 0px;
  padding: 1.8rem;
  font-size: 60px;
  font-weight: 700;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.chat__header__greetings {
  color: #292929;
  margin-top: 20px;
}
</style>
