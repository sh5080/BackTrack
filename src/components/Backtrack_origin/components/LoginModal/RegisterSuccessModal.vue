<template>
  <v-dialog v-model="$store.state.showRegisterSuccessModal" persistent="">
    <div class="success-modal">
      <h2 class="mb-3" style="font-size: 6em; margin-top: 400px">
        {{ $store.state.loggedInUsername }} 님
      </h2>

      <div style="font-size: 3em; margin-top: 100px">
        회원가입에 성공했습니다. 환영합니다! <br />만들어진 백킹트랙을 저장하고
        불러올 수 있습니다.
      </div>

      <button
        type="button"
        @click="closeAllModals"
        class="btn-success"
        style="font-size: 3.5em"
      >
        확인
      </button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  methods: {
    closeAllModals() {
      this.$store.commit("toggleLoginModal", false);
      this.$store.commit("toggleRegisterModal", false);
      this.$store.commit("toggleRegisterSuccessModal", false);
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.success-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid lightgray;
  padding: 4rem 4rem;
  border-radius: 5px;
  background: #fefefe;
  max-width: 1500px;
  width: 100%;
  height: 2000px;
  text-align: center;
}

.success-modal h2 {
  font-size: 6em;
  margin-top: 400px;
  margin-bottom: 1rem;
}

.success-modal div {
  font-size: 3em;
  margin-top: 100px;
  margin-bottom: 2rem;
}

.btn-success {
  position: relative;
  left: 50%;
  padding: 1em 2.5em;
  font-size: 3.5em;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 700;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  transform: translateX(-50%);
}

.btn-success:hover {
  background-color: #155724;
  box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
  color: #fff;
  transform: translate(-50%, -7px);
}

.btn-success:active {
  transform: translate(-50%, -1px);
}
</style>
