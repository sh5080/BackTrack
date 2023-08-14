<template>
  <div id="content" class="container">
    <form @submit.prevent="login" style="margin-left: 10px" autocomplete="off">
      <h2 class="mb-3" style="position: relative; top: 50px; font-size: 6em">
        로그인
      </h2>
      <div class="input">
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
            margin-top: 100px;
            /* margin-bottom: 150px; */
          "
        />
      </div>

      <div class="input">
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
            margin-top: -90px;
            /* margin-bottom: 100px; */
          "
        />
      </div>
      <div
        class="login-error-alert alert-warning alert-dismissible fade show mt-5"
        role="alert"
        v-if="errorAlert"
        :class="{ 'error-shake-animation': isShaking }"
        style="font-size: 3em; text-align: center"
      >
        {{ errorMessage }}
      </div>

      <!-- <div class="oauth-login-buttons">
        <button @click="oauthLogin('kakao')" class="oauth-button">
          Kakao 로그인
        </button>
        <button @click="oauthLogin('google')" class="oauth-button">
          Google 로그인
        </button>
        <button @click="oauthLogin('naver')" class="oauth-button">
          Naver 로그인
        </button>
     
      </div> -->

      <v-dialog v-model="$store.state.showRegisterModal">
        <Register
          @closeRegister="hideRegisterModal"
          @closeLoginInRegister="hideLoginModal"
        />
      </v-dialog>
      <v-dialog v-model="$store.state.showFindUsernameModal">
        <FindUsername />
      </v-dialog>
      <button
        v-if="showLoginButton"
        type="submit"
        class="btn-pers"
        id="login_button"
        style="font-size: 3.5em"
      >
        Login
      </button>
      <div
        class="alternative-option"
        style="
          font-size: 3em;
          display: grid;
          grid-gap: 10px;
          grid-auto-flow: column;
        "
      >
        <span
          @click="openRegisterModal"
          style="font-size: 1.3em; cursor: pointer"
          >회원가입</span
        >
        <span
          @click="openFindUsernameModal"
          style="font-size: 1.3em; cursor: pointer"
          >아이디 찾</span
        >
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Register from "./RegisterModal.vue";
import FindUsername from "./findUsernameModal.vue";
import { mapMutations } from "vuex";
export default {
  components: {
    Register,
    FindUsername,
  },
  data() {
    return {
      username: "",
      password: "",

      errorAlert: false,
      isShaking: false,
      showLoginButton: true,
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
      if (errorMessage.includes("필수")) {
        this.errorAlert = true;
        this.errorMessage = "아이디와 비밀번호를 입력해 주세요.";
      } else if (errorMessage.includes("없는")) {
        this.errorAlert = true;
        this.errorMessage = "없는 사용자이거나 비밀번호가 일치하지 않습니다.";
      } else if (errorMessage) {
        this.errorAlert = true;
        this.errorMessage = errorMessage;
      }

      setTimeout(() => {
        this.isShaking = false;
        this.clearErrors();
      }, 3000);
    },
    // async oauthLogin(provider) {
    //   try {
    //     // OAuth 로그인 처리 로직 구현
    //     const response = await axios.post(`/api/oauth/${provider}`);
    //     const accessToken = response.data.accessToken;

    //     // 로그인 성공 후의 처리 (예: 토큰 저장 등)
    //   } catch (error) {
    //     // 오류 처리 로직
    //   }
    // },

    openRegisterModal() {
      this.$store.commit("toggleRegisterModal", true);
    },
    hideRegisterModal() {
      this.$store.commit("toggleRegisterModal", false);
    },
    openFindUsernameModal() {
      this.$store.commit("toggleFindUsernameModal", true);
    },

    hideLoginModal() {
      this.$store.commit("toggleLoginModal", false);
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
        this.showLoginButton = false;

        if (response.data.message === "로그인 성공") {
          this.setAuthenticated(true);
          this.$store.commit("setLoggedInUsername", response.data.user);

          this.$emit("closeLogin");
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
  /* z-index: 9996; */
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
  margin-top: 100px;
}

.alternative-option > span {
  color: #0e9448;
  cursor: pointer;
}
.login-error-alert {
  font-size: 0.9rem;
  margin-bottom: -92px;
}
</style>
