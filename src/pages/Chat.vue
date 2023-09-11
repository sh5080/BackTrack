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
    <v-card v-if="isAdmin" class="mx-auto" width="1200">
      <v-list v-model:closed="open">
        <v-list-group value="Users">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-account-circle"
              title="현재 채팅 요청 온 사용자"
            ></v-list-item>
          </template>

          <v-list-item
            v-for="(sender, receiver) in activeUsers"
            :key="sender"
            :title="receiver"
            prepend-icon="mdi-account"
            @click="startChat(receiver, sender)"
          >
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-card>
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
import * as Toast from "../plugins/toast";
export default {
  data: () => ({
    open: ["Users"],
    chip: true,
    receiver: null,
  }),
  methods: {
    hideChat() {
      this.$emit("hide-chat");
    },
    startChat(originReceiver, originSender) {
      console.log("originSender: ", originSender);
      console.log("originReceiver: ", originReceiver);

      // this.$store.dispatch("startChat", {
      //   sender: this.nickname,
      //   receiver: sender,
      // });
      this.$store.commit("addReceiver", originSender);
      // this.receiver = originSender;
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
      //사용자인 경우
      if (!store.state.isAdmin) {
        pushmessageData({
          nickname: nickname.value,
          message,
        });
        socket.emit("chat", {
          sender: nickname.value,
          receiver: "admin",
          message,
        });
      }
      //어드민인 경우
      else {
        if (!store.state.activeReceiver) {
          Toast.customError("메세지를 받을 사용자를 선택해주세요.");
          return;
        }
        pushmessageData({
          nickname: nickname.value,
          message,
        });
        socket.emit("chat", {
          sender: "admin",
          receiver: store.state.activeReceiver,
          message,
          isAdmin: store.state.isAdmin,
        });
      }
    };
    socket.on("activeUsers", (data) => {
      store.commit("addActiveUserByServer", data);
    });
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
  computed: {
    isAdmin() {
      return this.$store.state.isAdmin;
    },
    activeUsers() {
      console.log("현재 채팅중인 유저목록: ", this.$store.state.activeUsers);
      console.log("activeReceiver: ", this.$store.state.activeReceiver);
      return this.$store.state.activeUsers;
    },
    activeReceiver() {
      return this.$store.state.activeReceiver;
    },
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
::v-deep .v-list {
  top: 1000px;
  position: fixed;
  right: 1000px;
}
::v-deep .v-list-item {
  font-size: 70px;
}

::v-deep .v-list-item-title {
  font-size: 50px;
  line-height: 50px;
}
</style>
