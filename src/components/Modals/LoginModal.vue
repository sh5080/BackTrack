<template>
  <div id="content" class="container">
    <form @submit.prevent="login" autocomplete="off">
      <h2 class="title" style="position: relative; font-size: 2em">로그인</h2>
      <div class="input">
        <input
          class="form-control"
          type="text"
          name="username"
          placeholder="아이디"
          v-model="username"
          style="font-size: 1em; padding: 0.5em; height: 1em"
        />

        <input
          class="form-control"
          type="password"
          name="password"
          placeholder="비밀번호"
          v-model="password"
          style="font-size: 1em; padding: 0.5em; height: 1em"
        />
      </div>
      <div
        class="login-error-alert alert-warning fade show"
        role="alert"
        v-if="errorAlert"
        :class="{ 'error-shake-animation': isShaking }"
      >
        {{ errorMessage }}
      </div>

      <v-dialog v-model="$store.state.showRegisterModal">
        <Register />
      </v-dialog>
      <v-dialog v-model="$store.state.showFindUsernameModal">
        <FindUsername />
      </v-dialog>
      <v-dialog v-model="$store.state.showFindPasswordModal">
        <FindPassword />
      </v-dialog>

      <button
        type="submit"
        class="btn-pers"
        id="login_button"
        style="font-size: 0.85em"
      >
        Login
      </button>

      <div class="image-button">
        <img
          @click="oauthLogin('GOOGLE')"
          src="/img/google.png"
          style="margin-top: 50px; width: 51%"
          alt="Google 로그인"
        />
      </div>

      <div class="image-button">
        <img
          @click="oauthLogin('KAKAO')"
          src="/img/kakao.png"
          alt="카카오 로그인"
          class="image-button-img"
        />
      </div>

      <div
        class="alternative-option"
        style="display: grid; grid-gap: 10px; grid-auto-flow: column"
      >
        <span
          class="alt-reg"
          @click="openRegisterModal"
          style="font-size: 1.2em; cursor: pointer"
          >회원가입</span
        >
        <div class="alt-container">
          <div
            class="alt-id"
            @click="openFindUsernameModal"
            style="font-size: 1.2em; cursor: pointer"
          >
            아이디 찾기
          </div>
          <div style="padding: 0px 5px">/</div>
          <div
            class="alt-pw"
            @click="openFindPasswordModal"
            style="font-size: 1.2em; cursor: pointer"
          >
            비밀번호 재설정
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Register from "./RegisterModal.vue";
import FindUsername from "./findUsernameModal.vue";
import FindPassword from "./findPasswordModal.vue";
// import OauthLogin from "./OauthLoginModal.vue";
import qs from "qs";
import { mapMutations } from "vuex";
export default {
  components: {
    Register,
    FindUsername,
    FindPassword,
    // OauthLogin,
  },

  data() {
    return {
      username: "",
      password: "",

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
      if (errorMessage.includes("필수")) {
        this.errorAlert = true;
        this.errorMessage = "아이디와 비밀번호를 입력해 주세요.";
      } else if (errorMessage.includes("없는")) {
        this.errorAlert = true;
        this.errorMessage = "없는 사용자이거나 비밀번호가 일치하지 않습니다.";
      } else {
        errorMessage;
        this.errorAlert = true;
        this.errorMessage = errorMessage;
      }

      setTimeout(() => {
        this.isShaking = false;
        this.clearErrors();
      }, 300000);
    },

    async oauthLogin(provider) {
      try {
        const loginUrl = this.generateLoginUrl(provider);
        localStorage.setItem("oauth", provider);
        window.location.href = loginUrl;
      } catch (error) {
        console.error(error);
      }
    },

    generateLoginUrl(oauthProvider) {
      const clientId = process.env[`VUE_APP_${oauthProvider}_CLIENT_ID`];
      const redirectUri = process.env[`VUE_APP_${oauthProvider}_REDIRECT_URI`];
      let params = {};

      if (oauthProvider === "KAKAO") {
        const responseType = "code";
        params = {
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: responseType,
        };
      } else if (oauthProvider === "GOOGLE") {
        const scope =
          "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
        const responseType = "code";
        params = {
          client_id: clientId,
          redirect_uri: redirectUri,
          scope: scope,
          response_type: responseType,
        };
      } else {
        throw new Error(`Unsupported OAuth provider: ${oauthProvider}`);
      }

      const queryString = qs.stringify(params);
      const baseUrl =
        oauthProvider === "KAKAO"
          ? "https://kauth.kakao.com/oauth/authorize"
          : "https://accounts.google.com/o/oauth2/auth";
      const loginUrl = `${baseUrl}?${queryString}`;
      return loginUrl;
    },

    openRegisterModal() {
      this.$store.commit("toggleRegisterModal", true);
    },
    hideRegisterModal() {
      this.$store.commit("toggleRegisterModal", false);
    },
    openFindUsernameModal() {
      this.$store.commit("toggleFindUsernameModal", true);
    },
    openFindPasswordModal() {
      this.$store.commit("toggleFindPasswordModal", true);
    },

    hideLoginModal() {
      this.$store.commit("toggleLoginModal", false);
    },

    ...mapMutations(["setAuthenticated", "setSessionData"]),

    async login(submitEvent) {
      this.username = submitEvent.target.elements.username.value;
      this.password = submitEvent.target.elements.password.value;

      try {
        const response = await this.$axios.post(
          "/api/auth/login",
          {
            username: this.username,
            password: this.password,
          },
          { withCredentials: true }
        );

        if (response.data.message === "로그인 성공") {
          localStorage.setItem("oauth", "Backtrack");
          this.$emit("closeLogin");
          this.$router.go();
        }
      } catch (error) {
        console.error("Error logging in:", error);
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
  padding: 1rem;
  border-radius: 5px;
  background: #fefefe;
  max-width: 470px;
  max-height: 600px;
}
.title {
  font-weight: 600;
  margin-left: 40px;
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
  width: 1700px !important;
  height: 2500px;
  max-width: 95%;
  /* z-index: 9996; */
}

.input {
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  margin-bottom: 30px;
  align-items: center;
  /* padding: 50px; */
}

.input > label {
  text-align: start;
}

.input > input {
  margin-top: 20px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  width: 75%;
  height: 39px !important;
}

.image-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: none;
  border: none;
  padding: 0;
}

.image-button img {
  /* width: 250%;
  max-width: 700px; */
  width: 50%;
  height: auto;
  margin-right: auto;
  margin-left: auto;
  object-fit: cover;

  /* height: 208px; */
}
/* .image-button-img {
  width: 100%;
  max-width: 680px;
  height: 200px;
  object-fit: cover;
} */

.btn-pers {
  position: relative;
  left: 50%;
  width: 75%;
  padding: 1em 2.5em;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 700;
  color: #000;
  background-color: #cff7aa;
  border: none;
  border-radius: 15px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  transform: translateX(-50%);
  margin-top: 40px;
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
  margin-top: 20px;
  transition: transform 0.2s;
}
.alt-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.alt-id:hover,
.alt-pw:hover,
.alt-reg:hover {
  transform: scale(1.02);
}
.alt-container,
.alternative-option > span {
  color: #0e9448;
  cursor: pointer;
}

.login-error-alert {
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: -21.5px;
  width: 80%;
  position: relative;
  left: 10%;
}
</style>
