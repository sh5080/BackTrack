<template>
  <div id="content" class="container">
    <button
      @click="checkUsername"
      class="btn-check"
      type="button"
      :class="{ 'btn-success': usernameIsValid }"
      style="font-size: 3em"
    >
      중복확인
    </button>
    <form
      @submit.prevent="register"
      style="margin-left: 10px"
      autocomplete="off"
    >
      <h2
        class="mb-3"
        style="font-size: 6em; margin-top: -90px; padding-bottom: 0px"
      >
        회원가입
      </h2>
      <div class="input-reg">
        <label for="username" style="font-size: 4em; margin-top: 80px"
          >아이디</label
        >

        <input
          class="form-control"
          type="text"
          v-model="username"
          placeholder="아이디"
          style="
            font-size: 4em;
            padding: 0.5em;
            height: 1em;
            margin-top: 10px;
            margin-bottom: 20px;
          "
        />
      </div>

      <div
        class="alert_username alert-warning alert-dismissible fade show error-shake-animation"
        role="alert"
        v-if="usernameError"
        :class="{ 'error-shake-animation': isShaking }"
        style="font-size: 3em; text-align: center"
      >
        <div class="error-message">
          {{ usernameErrorMessage }}
        </div>
      </div>
      <div
        class="alert_correct alert-success alert-dismissible fade show"
        role="alert"
        v-if="usernameIsValid"
        style="font-size: 3em; text-align: center"
      >
        {{ usernameMessage }}
      </div>

      <div class="input-reg3">
        <div>
          <label for="nickname" style="font-size: 4em; margin-top: 100px"
            >닉네임</label
          >
          <button
            @click="checkNickname"
            class="btn-check"
            type="button"
            :class="{ 'btn-success': nicknameIsValid }"
            style="font-size: 3em; left: 74%"
          >
            중복확인
          </button>
        </div>
        <input
          class="form-control"
          type="text"
          v-model="nickname"
          placeholder="닉네임"
          style="
            font-size: 4em;
            padding: 0.5em;
            height: 1em;
            margin-top: 10px;
            margin-bottom: 20px;
          "
        />
      </div>
      <div
        class="alert_nickname alert-warning alert-dismissible fade show error-shake-animation"
        role="alert"
        v-if="nicknameError"
        :class="{ 'error-shake-animation': isShaking }"
        style="font-size: 3em; text-align: center"
      >
        <div class="error-message">
          {{ nicknameErrorMessage }}
        </div>
      </div>
      <div
        class="alert_correct alert-success alert-dismissible fade show"
        role="alert"
        v-if="nicknameIsValid"
        style="font-size: 3em; text-align: center; margin-bottom: -152px"
      >
        {{ nicknameMessage }}
      </div>
      <div class="input-reg">
        <label for="password" style="font-size: 4em; margin-top: 140px"
          >비밀번호 (영문, 숫자 포함 10자 이상 20자 이내)</label
        >
        <input
          class="form-control"
          type="password"
          v-model="password"
          placeholder="비밀번호"
          @blur="validatePasswordValidity"
          style="
            font-size: 4em;
            padding: 0.5em;
            height: 1em;
            margin-top: 20px;
            margin-bottom: 0px;
          "
        />
        <input
          class="form-control"
          type="password"
          v-model="passwordConfirm"
          placeholder="비밀번호 확인"
          @blur="validatePasswordEquality"
          style="
            font-size: 4em;
            padding: 0.5em;
            height: 1em;
            margin-top: 0px;
            margin-bottom: 0px;
          "
        />
      </div>
      <div
        class="alert_password alert-warning alert-dismissible fade show mt-5"
        role="alert"
        v-if="passwordError"
        :class="{ 'error-shake-animation': isShaking }"
        style="font-size: 3em; text-align: center"
      >
        {{ passwordErrorMessage }}
      </div>

      <div class="input-reg3">
        <label for="email" style="font-size: 4em; margin-top: 100px"
          >이메일</label
        >
        <input
          class="form-control"
          type="text"
          v-model="email"
          placeholder="이메일   (비밀번호 찾기 등에 사용됩니다.)"
          @blur="validateEmail"
          style="
            font-size: 4em;
            padding: 0.5em;
            height: 1em;
            margin-top: 10px;
            margin-bottom: 20px;
          "
        />
      </div>
      <div
        class="alert-reg alert-warning alert-dismissible fade show mt-5"
        role="alert"
        v-if="emailError"
        :class="{ 'error-shake-animation': isShaking }"
        style="font-size: 3em; text-align: center"
      >
        {{ emailErrorMessage }}
      </div>

      <div class="alternative-option" style="font-size: 3em">
        이미 가입되어 있으신가요?
        <span
          @click="hideRegisterModal"
          style="font-size: 1.3em; cursor: pointer"
          >로그인</span
        >
      </div>
      <button
        v-if="showRegisterButton"
        type="submit"
        class="mt-4 btn-reg"
        style="font-size: 3.5em"
      >
        Register
      </button>
      <v-dialog v-model="$store.state.showRegisterSuccessModal">
        <RegisterSuccess @closeRegisterSuccess="closeRegisterSuccessModal" />
      </v-dialog>
    </form>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import RegisterSuccess from "./RegisterSuccessModal.vue";
export default {
  components: { RegisterSuccess },
  data() {
    return {
      username: "",
      nickname: "",
      email: "",
      password: "",
      passwordConfirm: "",
      showRegisterButton: true,
      isLoginModalVisible: false,
      emailError: false,
      emailErrorMessage: "",
      usernameError: false,
      usernameErrorMessage: "",
      nicknameError: false,
      nicknameErrorMessage: "",
      passwordError: false,
      passwordErrorMessage: "",
      isShaking: false,
      usernameIsValid: false,
      usernameMessage: "",
      nicknameIsValid: false,
      nicknameMessage: "",
    };
  },

  methods: {
    validatePasswordEquality() {
      if (this.password !== this.passwordConfirm) {
        this.isShaking = true;
        this.passwordErrorMessage =
          "비밀번호와 비밀번호 확인이 일치하지 않습니다.";
        this.passwordError = true;
        setTimeout(() => {
          this.isShaking = false;
          this.clearErrors();
        }, 1000);
      } else {
        this.passwordErrorMessage = "";
        this.passwordError = false;
        setTimeout(() => {
          this.isShaking = false;
          this.clearErrors();
        }, 1000);
      }
    },
    validatePasswordValidity() {
      const passwordPattern =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,20}$/;

      if (!passwordPattern.test(this.password)) {
        this.isShaking = true;
        this.passwordErrorMessage =
          "비밀번호는 영문, 숫자, 특수문자를 포함하여 10자 이상 20자 이내여야 합니다.";
        this.passwordError = true;
        setTimeout(() => {
          this.isShaking = false;
          this.clearErrors();
        }, 1000);
      } else {
        this.passwordErrorMessage = "";
        this.passwordError = false;
        setTimeout(() => {
          this.isShaking = false;
          this.clearErrors();
        }, 1000);
      }
    },
    validateEmail() {
      if (!this.email.includes("@")) {
        this.isShaking = true;
        this.emailErrorMessage = "올바른 이메일 형식을 사용해주세요.";
        this.emailError = true;
        setTimeout(() => {
          this.isShaking = false;
          this.clearErrors();
        }, 1000);
      } else {
        this.emailErrorMessage = "";
        this.emailError = false;
        setTimeout(() => {
          this.isShaking = false;
          this.clearErrors();
        }, 1000);
      }
    },

    clearErrors() {
      this.emailError = false;
      this.emailErrorMessage = "";
      this.usernameError = false;
      this.usernameErrorMessage = "";
      this.passwordError = false;
      this.passwordErrorMessage = "";
    },
    handleErrors(error) {
      this.isShaking = true;
      this.clearErrors(); // 이전 에러를 초기화

      const errorMessage = error.response.data.message;
      if (
        errorMessage.includes("password") ||
        errorMessage.includes("email") ||
        errorMessage.includes("username")
      ) {
        this.emailError = true;
        this.emailErrorMessage = "빈 칸을 모두 입력해주세요.";
      } else if (errorMessage.includes("아이디")) {
        this.usernameError = true;
        this.usernameErrorMessage = errorMessage;
      } else if (errorMessage.includes("비밀번호")) {
        this.passwordError = true;
        this.passwordErrorMessage = errorMessage;
      } else {
        // 기타 에러 메세지
        this.emailError = true;
        this.emailErrorMessage = errorMessage;
      }
      setTimeout(() => {
        this.isShaking = false;
        this.clearErrors();
      }, 1000);
    },
    hideRegisterModal() {
      this.$store.commit("toggleRegisterModal", false);
    },
    openRegisterSuccessModal() {
      this.$store.commit("toggleRegisterSuccessModal", true);
    },
    closeRegisterSuccessModal() {
      this.$store.commit("toggleRegisterSuccessModal", false);
    },

    async checkUsername() {
      try {
        const response = await this.$axios.get(
          `/api/auth/check/username`,
          {
            params: { username: this.username },
          },
          { withCredentials: true }
        );

        this.usernameIsValid = true;

        this.usernameMessage = response.data.message;
      } catch (error) {
        this.usernameIsValid = false;
        this.isShaking = true;
        console.error("Error checking username availability:", error);

        this.usernameError = true;
        this.usernameErrorMessage = error.response.data.message;
        setTimeout(() => {
          this.isShaking = false;
          this.usernameError = false;
        }, 1000);
      }
    },
    async checkNickname() {
      try {
        const response = await this.$axios.get(
          `/api/auth/check/nickname`,
          {
            params: { nickname: this.nickname },
          },
          { withCredentials: true }
        );

        this.nicknameIsValid = true;

        this.nicknameMessage = response.data.message;
      } catch (error) {
        this.nicknameIsValid = false;
        this.isShaking = true;
        console.error("Error checking nickname availability:", error);

        this.nicknameError = true;
        this.nicknameErrorMessage = error.response.data.message;
        setTimeout(() => {
          this.isShaking = false;
          this.nicknameError = false;
        }, 1000);
      }
    },

    ...mapMutations(["setAuthenticated"]),
    async register() {
      if (
        this.usernameIsValid &&
        this.usernameMessage === "사용 가능한 아이디입니다." &&
        this.nicknameIsValid &&
        this.nicknameMessage === "사용 가능한 닉네임입니다."
      ) {
        try {
          const response = await this.$axios.post(
            "/api/auth/signup",
            {
              username: this.username,
              nickname: this.nickname,
              password: this.password,
              passwordConfirm: this.passwordConfirm,
              email: this.email,
            },
            { withCredentials: true }
          );
          if (response.data.message.includes("회원가입에 성공했습니다.")) {
            const loginResponse = await this.$axios.post(
              "/api/auth/login",
              {
                username: this.username,
                password: this.password,
              },
              { withCredentials: true }
            );

            this.$store.commit("setLoginProvider", "Backtrack");
            this.$store.commit("toggleRegisterSuccessModal", true);
            this.$router.go();
          }
        } catch (error) {
          console.error("Registration error:", error);
          this.handleErrors(error);
        }
      } else {
        this.isShaking = true;
        this.emailError = true;
        this.emailErrorMessage = "아이디 및 닉네임 중복확인이 필요합니다.";
        setTimeout(() => {
          this.isShaking = false;
          this.emailError = false;
        }, 1000);
      }
    },
  },
};
</script>

<style scoped>
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
  width: 1600px;
  /* z-index: 9997; */
}
.mb-3 {
  font-weight: 600;
}
.mt-3nt {
  max-height: calc(100% - 48px);
  width: calc(100% - 48px);
  max-width: calc(100% - 48px);
  margin: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.input-reg {
  display: flex;
  flex-direction: column;
  margin-top: -80px;
  margin-bottom: 0px;
}
.input-reg3 {
  display: flex;
  flex-direction: column;
  margin-top: 0px;
  margin-bottom: 0px;
}

.input-reg > label {
  /* display: flex; */
  text-align: start;
}

.input-reg3 > input,
.input-reg > input {
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 150px !important;
}

.btn-reg {
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
.btn-check {
  position: relative;
  top: 6%;
  left: 85%;
  padding: 0.5em 2.5em;
  font-size: 8px;
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
.btn-check:hover,
.btn-reg:hover {
  background-color: #198754;
  box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
  color: #fff;
  transform: translate(-50%, -7px);
}
.btn-success {
  background-color: #198754;
}

.btn-reg:active {
  transform: translate(-50%, -1px);
}
.btn-check:active {
  transform: translate(-50%, -1px);
}

.alternative-option {
  text-align: center;
  margin-top: 130px;
}

.alternative-option > span {
  color: #0e9448;
  cursor: pointer;
}

.alert_username {
  font-size: 0.9rem;
  margin-bottom: -72px;
}
.alert_nickname {
  font-size: 0.9rem;
  margin-bottom: -152px;
}
.alert_password {
  font-size: 0.9rem;

  margin-bottom: -48px;
  max-height: 0px;
}
.alert {
  font-size: 0.9rem;
  margin-bottom: -142px;
}
.alert_correct {
  font-size: 0.9rem;
  /* margin-bottom: -152px; */
  margin-bottom: -72px;
}
.alert-reg {
  font-size: 0.9rem;
  /* margin-bottom: -92px; */
  margin-bottom: -120px;
}
</style>
