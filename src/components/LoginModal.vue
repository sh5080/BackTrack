<template>
  <div id="content" class="container">
    <form @submit.prevent="login" style="margin-left: 10px">
      <h2 class="mb-3" style="font-size: 6em">로그인</h2>
      <div class="input">
        <label for="username" style="font-size: 4.5em; margin-top: 100px"
          >아이디</label
        >
        <input
          class="form-control"
          type="text"
          name="username"
          placeholder="아이디"
          v-model="username"
          style="
            font-size: 4em;
            padding: 0.5em;
            height: 1em;
            margin-top: 10px;
            margin-bottom: 20px;
          "
        />
      </div>

      <div class="input">
        <label for="password" style="font-size: 4.5em; margin-top: 100px"
          >비밀번호</label
        >
        <input
          class="form-control"
          type="password"
          name="password"
          placeholder="비밀번호"
          v-model="password"
          style="
            font-size: 4em;
            padding: 0.5em;
            height: 1em;
            margin-top: 10px;
            /* margin-bottom: 100px; */
          "
        />
      </div>
      <div
        class="alert alert-warning alert-dismissible fade show mt-5"
        role="alert"
        v-if="errorAlert"
        :class="{ 'error-shake-animation': isShaking }"
        style="font-size: 3em; text-align: center"
      >
        {{ errorMessage }}
      </div>

      <div class="alternative-option" style="font-size: 3em">
        회원이 아니신가요?
        <span
          @click="showRegisterModal"
          style="font-size: 1.3em; cursor: pointer"
          >회원가입</span
        >
      </div>
      <Register
        v-if="isRegisterModalVisible"
        @close="hideRegisterModal"
        @showLogin="showLoginModal"
        @restoreLoginButton="restoreLoginButton"
      />
      <button
        v-if="showLoginButton"
        type="submit"
        class="mt-4 btn-pers"
        id="login_button"
        style="font-size: 3.5em"
      >
        Login
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Register from "./RegisterModal.vue";
import { mapMutations } from "vuex";
export default {
  components: {
    Register,
  },
  data() {
    return {
      username: "",
      password: "",
      showLoginButton: true,
      isRegisterModalVisible: false,
      errorAlert: false,
      isShaking: false,

      errorMessage: "",
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
      if (errorMessage.includes("필수 입력값이 누락되었습니다:"))
        this.errorAlert = true;
      this.errorMessage = "아이디 혹은 비밀번호를 확인해주세요.";

      setTimeout(() => {
        this.isShaking = false;
        this.clearErrors();
      }, 3000);
    },

    showRegisterModal() {
      this.isRegisterModalVisible = true;
      this.showLoginButton = false;
    },
    hideRegisterModal() {
      this.isRegisterModalVisible = false;
    },
    closeRegisterModal() {
      this.isRegisterModalVisible = false;
    },
    showLoginModal() {
      this.isLoginModalVisible = true;
      this.showLoginButton = false;
    },
    restoreLoginButton() {
      this.showLoginButton = true;
    },
    ...mapMutations(["setAuthenticated"]),
    async login(submitEvent) {
      this.username = submitEvent.target.elements.username.value;
      this.password = submitEvent.target.elements.password.value;

      try {
        const response = await axios.post(
          "http://localhost:4000/api/auth/login",
          {
            username: this.username,
            password: this.password,
          },
          { withCredentials: true }
        );
        // 로그인 성공 시 로그인 버튼 숨김
        this.showLoginButton = false;
        // 백엔드에서 반환된 데이터 처리
        if (response.data.message === "로그인 성공") {
          this.setAuthenticated(true);
          this.$store.commit(
            "setLoggedInUsername",
            response.data.user.username
          );
          this.$emit("close");
          this.$router.push("/");
        }
      } catch (error) {
        console.error("Error logging in:", error);
        this.handleErrors(error);
      }
    },
  },
};
</script>

<style>
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
}

.input {
  display: flex;
  flex-direction: column;
  /* margin-bottom: 15px; */
}

.input > label {
  text-align: start;
}

.input > input {
  margin-top: 100px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100px !important;
}

.btn-pers {
  position: relative;
  left: 50%;
  padding: 1em 2.5em;
  font-size: 12px;
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
  margin-top: 100px;
}

.alternative-option > span {
  color: #0e9448;
  cursor: pointer;
}
.alert {
  font-size: 0.9rem;

  margin-bottom: -91px;
  margin-top: 1rem;
}
</style>
