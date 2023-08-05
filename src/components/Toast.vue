<template>
  <v-snackbar v-model="show" :color="color" :timeout="timeout" bottom left>
    {{ message }}
    <v-btn text color="white" @click="show = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: "ToastMessage",
  props: {
    message: String,
    color: String,
    timeout: {
      type: Number,
      default: 3000,
    },
  },
  data() {
    return {
      show: false,
    };
  },
};
</script>

<style scoped>
/* 스타일 조정을 여기에 추가합니다 */
.v-snack__wrapper {
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  font-family: "Roboto";
  color: white;
  text-align: center;
}

.v-btn--text {
  color: white;
}
</style>
