<template>
  <div class="chat__body" id="chat__body">
    <chat-message
      v-for="(message, index) in messages"
      :key="index"
      :message="message"
      :prev="[index == 0 ? null : messages[index - 1]]"
    >
    </chat-message>
  </div>
</template>

<script>
import ChatMessage from "./ChatMessage.vue";

export default {
  components: {
    ChatMessage,
  },
  props: ["messages"],
};
</script>

<style>
.chat__body {
  padding: 2rem;
  overflow: scroll;
  scroll-behavior: smooth;
}

.chat__body::-webkit-scrollbar {
  display: none;
}
</style>
