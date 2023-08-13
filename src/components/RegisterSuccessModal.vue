<template>
  <div id="content" class="container">
    <v-card>
      <v-card-title>가입 성공</v-card-title>
      <v-card-text> 회원가입에 성공했습니다. 환영합니다! </v-card-text>
      <v-card-actions>
        <v-btn @click="closeModal">확인</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  methods: {
    closeModal() {
      this.$store.commit("toggleRegisterSuccessModal", false);
      this.$store.commit("toggleRegisterModal", false);
      this.$store.commit("toggleLoginModal", false);
    },
  },
};
</script>

<style>
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid lightgray;
  padding: 4rem 4rem;
  border-radius: 5px;
  background: #fefefe;
  max-width: 2000px;
  max-height: 80vh;
  width: 1500px;
}
</style>
