<template>
  <div id="content" class="container">
    <form
      @submit.prevent="findUsername"
      style="margin-left: 10px"
      autocomplete="off"
    >
      <h2 class="mb-3" style="position: relative; top: 50px; font-size: 6em">
        아이디 찾기
      </h2>
      <p
        style="
          font-size: 3.5em;
          padding: 0.5em;
          height: 1em;
          margin-top: 100px;
          margin-left: 0px;
          text-align: center;
        "
      >
        가입할 때 입력한 이메일로 아이디를 찾을 수 있습니다.
      </p>
      <div class="input">
        <input
          class="form-control"
          type="text"
          name="email"
          placeholder="이메일"
          v-model="email"
          style="font-size: 4em; padding: 0.5em; height: 1em; margin-top: 100px"
        />
      </div>

      <div
        class="alert_correct alert-success alert-dismissible fade show"
        role="alert"
        v-if="emailIsValid"
        style="font-size: 3em; text-align: center"
      >
        {{ usernameMessage }}
      </div>

      <div
        class="findUsername-error-alert alert-warning alert-dismissible fade show mt-5"
        role="alert"
        v-if="errorAlert"
        :class="{ 'error-shake-animation': isShaking }"
        style="font-size: 3em; text-align: center"
      >
        {{ errorMessage }}
      </div>

      <button
        type="submit"
        class="btn-pers"
        id="login_button"
        style="
          font-size: 3.5em;
          display: grid;
          grid-gap: 10px;
          grid-auto-flow: column;
        "
      >
        아이디 찾기
      </button>
      <div class="alternative-option" style="font-size: 3em">
        <span
          @click="hideFindUsernameModal"
          style="font-size: 1.3em; cursor: pointer"
          >로그인</span
        >

        <span
          @click="openFindPasswordModal"
          style="font-size: 1.3em; margin-left: 100px; cursor: pointer"
          >비밀번호 재설정</span
        >
      </div>
    </form>
  </div>
</template>

<script>
// import Register from "./RegisterModal.vue";

export default {
  components: {
    // Register,
  },
  data() {
    return {
      email: "",
      errorAlert: false,
      isShaking: false,

      errorMessage: "",
      usernameMessage: "",
      emailIsValid: false,
    };
  },
  methods: {
    clearErrors() {
      this.errorAlert = false;
      this.errorMessage = "";
    },
    handleErrors(error) {
      this.isShaking = true;
      this.clearErrors();

      const errorMessage = error.response.data.message;

      if (errorMessage) {
        this.errorAlert = true;
        this.errorMessage = errorMessage;
      }

      setTimeout(() => {
        this.isShaking = false;
        this.clearErrors();
      }, 3000);
    },

    hideFindUsernameModal() {
      this.$store.commit("toggleFindUsernameModal", false);
      this.$store.commit("toggleFindPasswordModal", false);
    },
    openFindPasswordModal() {
      this.$store.commit("toggleFindPasswordModal", true);
      this.$store.commit("toggleFindUsernameModal", false);
    },

    async findUsername(submitEvent) {
      this.emailIsValid = false;
      this.errorAlert = false;
      this.email = submitEvent.target.elements.email.value;

      if (!this.email) {
        this.email = undefined;
      }
      try {
        const response = await this.$axios.get(
          `/api/auth/Id/${this.email}`,

          { withCredentials: true }
        );
        const message = response.data.message;

        this.emailIsValid = true;
        this.usernameMessage = message;
      } catch (error) {
        console.error("아이디 찾기 중 오류:", error);
        this.handleErrors(error);
      }
    },
  },
};
</script>

<style scoped>
#content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid lightgray;
  padding: 4rem 4rem;
  border-radius: 5px;
  background: #fefefe;
  max-width: 2000px;
  max-height: 80vh;
}
.mb-3 {
  font-weight: 600;
}
.v-dialog > .v-overlay__content {
  max-height: calc(100% - 48px);
  width: calc(100% - 48px);
  max-width: calc(100% - 48px);
  margin: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.error-shake-animation {
  animation: shake 0.5s;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

.container {
  width: 1500px !important;
  height: 2000px;
  max-width: 95%;
  z-index: 9996 !important;
}

.input {
  display: flex;
  flex-direction: column;
  margin-top: 80px;
  margin-bottom: 0px;
  padding: 50px;
}

.input > label {
  text-align: start;
}

.input > input {
  margin-top: 100px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 150px !important;
}

.btn-pers {
  position: relative;
  left: 50%;
  width: 93%;
  padding: 1em 2.5em;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 700;
  color: #000;
  background-color: #cff7aa;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  transform: translateX(-50%);
  margin-top: 100px;
}

.btn-pers:hover {
  background-color: #198754;
  box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
  color: #fff;
  transform: translate(-50%, -7px);
}

.btn-pers:active {
  transform: translate(-50%, -1px);
}

.alternative-option {
  text-align: center;
  margin-top: 500px;
}

.alternative-option > span {
  color: #0e9448;
  cursor: pointer;
}
.alert_correct,
.findUsername-error-alert {
  font-size: 0.9rem;
  margin-bottom: -92px;
}
</style>
