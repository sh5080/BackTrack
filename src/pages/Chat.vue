<template>
  <div class="chat">
    <div class="chat__header">
      <v-row
        style="justify-content: space-between; padding: 30px 20px"
        class="justify-between align-center"
      >
        <span class="chat__header__greetings">
          안녕하세요. {{ nickname }}님!
        </span>

        <v-btn
          style="color: #999999; transform: rotate(45deg)"
          tonal
          density="compact"
          icon="mdi-plus"
          size="medium"
          @click="hideChat"
        ></v-btn>
      </v-row>
      <v-row>
        <v-card v-if="isAdmin" class="mx-auto" width="100%">
          <v-row>
            <v-col cols="6">
              <v-list v-model:closed="open">
                <v-list-group value="Users">
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      ref="activatorItem"
                      v-bind="props"
                      prepend-icon="mdi-account-circle"
                      title="현재 채팅 요청 온 사용자"
                    ></v-list-item>
                  </template>

                  <v-list-item
                    v-for="user in activeUsers"
                    :key="user"
                    :title="user"
                    prepend-icon="mdi-account"
                    @click="startChat(user)"
                  >
                  </v-list-item>
                </v-list-group>
              </v-list>
            </v-col>
            <v-col cols="6">
              <v-chip
                v-if="chip"
                size="x-large"
                class="ma-2"
                closable
                @click:close="chip = false"
              >
                {{ receiver }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card>
      </v-row>
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
import * as Toast from "../plugins/toast";
export default {
  data: () => ({
    open: false,
    chip: false,
    receiver: null,
  }),
  methods: {
    hideChat() {
      this.$emit("hide-chat");
    },
    startChat(user) {
      console.log("Selected user: ", user);
      this.$store.commit("addReceiver", user);
      this.receiver = user;
      this.chip = true;
      this.open = false;
      this.$refs.activatorItem.$el.click();
    },
  },
  setup() {
    const store = useStore();
    const nickname = computed(() => store.state.loggedInNickname);
    const messageData = computed(() => store.state.socket.messageData);

    const pushmessageData = (data) => {
      store.commit(Constant.PUSH_message_DATA, data);
    };

    const serverUrl = process.env.VUE_APP_SOCKET_URL;
    const socket = io(`${serverUrl}`);
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
      console.log(data);
      store.commit("addActiveUserByServer", data);
    });
    socket.on("messageData", (data) => {
      store.commit("setChatData", data);
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

    onBeforeUnmount(() => {});

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
  padding: 30px 50px;
  font-size: 60px;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chat__header__greetings {
  color: #292929;
  margin-top: 20px;
}
:deep(.v-chip__close) {
  font-size: 50px;
}
:deep(.v-list-item) {
  font-size: 70px;
}

:deep(.v-list-item-title) {
  font-size: 50px;
  line-height: 50px;
}
:deep(.v-chip) {
  padding: 0px 60px;
  height: 100px;
  max-width: 150%;
  font-size: 60px;
  text-align: center;
}
</style>
