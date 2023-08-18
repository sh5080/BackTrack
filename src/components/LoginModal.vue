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
        v-if="showLoginButton"
        type="submit"
        class="btn-pers"
        id="login_button"
        style="font-size: 3.5em"
      >
        Login
      </button>

      <div class="image-button">
        <button type="button" @click="oauthLogin('GOOGLE')">
          <img src="../assets/google2.png" alt="Google 로그인" />
        </button>
      </div>

      <div class="image-button">
        <button type="button" @click="oauthLogin('KAKAO')">
          <img
            src="../assets/kakao123.png"
            style="width: -40px"
            alt="카카오 로그인"
            class="image-button-img"
          />
        </button>
      </div>

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
          >아이디 찾기 /</span
        >
        <span
          @click="openFindPasswordModal"
          style="font-size: 1.3em; margin-left: -200px; cursor: pointer"
          >비밀번호 재설정</span
        >
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Register from "./RegisterModal.vue";
import FindUsername from "./findUsernameModal.vue";
import FindPassword from "./findPasswordModal.vue";
// import OauthLogin from "./OauthLoginModal.vue";
import { mapMutations } from "vuex";
import qs from "qs";
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
      } else {
        errorMessage;
        this.errorAlert = true;
        this.errorMessage = errorMessage;
      }

      setTimeout(() => {
        this.isShaking = false;
        this.clearErrors();
      }, 3000);
    },
    // async fetchUserInfo() {
    //   try {
    //     const response = await axios.get("/api/userInfo");
    //     this.username = response.data.username;
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },

    async oauthLogin(provider) {
      try {
        const loginUrl = this.generateLoginUrl(provider);
        console.log(loginUrl);

        window.location.href = loginUrl;

        this.$router.push("/");
      } catch (error) {
        console.error(error);
      }
    },

    // async handleOAuthCallback() {
    //   try {
    //     const response = await axios.get("/api/oauth/google/callback");
    //     console.log(response);
    //     // 사용자 정보를 저장하고 인증 상태를 설정

    //     // 로그인이 완료된 후의 처리를 수행
    //     // ...
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },

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
          ? "https://kauth.kakao.com"
          : "https://accounts.google.com";
      const loginUrl = `${baseUrl}/o/oauth2/auth?${queryString}`;
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
  width: 700px; /* 예시로 이미지의 가로 크기 조정 */
  height: auto;
  margin-right: auto; /* 이미지의 오른쪽 여백을 자동으로 채워줌 */
  margin-left: auto; /* 이미지의 왼쪽 여백을 자동으로 채워줌 */

  /* height: 208px; */
}
.image-button-img {
  width: 100%; /* 이미지의 가로 크기를 100%로 설정하여 부모 요소에 맞게 조정 */
  max-width: 680px; /* 이미지의 최대 가로 크기를 설정 */
  height: 200px;
  object-fit: cover; /* 이미지를 부모 요소에 맞춰 자르기 */
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
