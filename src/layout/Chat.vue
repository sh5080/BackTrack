<template>
  <v-sheet class="position-absolute" min-height="450">
    <div
      class="position-absolute d-flex align-center justify-center w-100 h-100"
    >
      <v-img src="../assets/chatIcon.png" @click="openDialog" class="chat-icon">
      </v-img>
    </div>

    <v-fade-transition hide-on-leave>
      <chat
        v-if="isUserLoggedIn && dialog"
        append-icon="$close"
        elevation="16"
        max-width="500"
        title="Send a receipt"
      >
        <template v-slot:append>
          <v-btn icon="$close" variant="text" @click="dialog = false"></v-btn>
        </template>
      </chat>
    </v-fade-transition>
  </v-sheet>
</template>
<script>
import Chat from "../pages/Chat.vue";
import * as Toast from "../plugins/toast";
export default {
  data() {
    return {
      dialog: false,
    };
  },
  components: {
    Chat,
  },
  computed: {
    isUserLoggedIn() {
      return this.$store.state.isAuthenticated;
    },
  },
  methods: {
    openDialog() {
      if (this.isUserLoggedIn) {
        this.dialog = true;
      } else {
        Toast.customError("로그인이 필요합니다.");
      }
    },
  },
};
</script>
<style scoped>
::v-deep .v-img__img {
  cursor: pointer;
  z-index: -1;
  position: fixed;

  top: auto;
  left: auto;
  bottom: 0;
  right: 0;
  width: 8%;
  height: auto;
}
</style>
