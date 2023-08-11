<template>
  <div id="content" class="container">
    <form @submit.prevent="register" style="margin-left: 10px">
      <h2 class="modal-title" style="font-size: 6em">회원가입</h2>
      <div class="input">
        <v-col>
          <label for="username" style="font-size: 4em; margin-top: 100px"
            >아이디</label
          >
          <button
            @click="checkUsername"
            class="mt-4 btn-check"
            style="font-size: 3em; margin-left: 300px"
          >
            중복확인
          </button>
        </v-col>
        <input
          class="form-control"
          type="text"
          v-model="username"
          placeholder="아이디"
          style="
            font-size: 4em;
            padding: 0.5em;
            height: 1em;
            margin-top: -10px;
            margin-bottom: 20px;
          "
        />
      </div>

      <div
        class="alert alert-warning alert-dismissible fade show error-shake-animation"
        role="alert"
        v-if="usernameError"
        :class="{ 'error-shake-animation': isShaking }"
        style="font-size: 3em; text-align: center; /* height: 1px */"
      >
        <div class="error-message">
          {{ usernameErrorMessage }}
        </div>
      </div>
      <div
        class="alert alert-success alert-dismissible fade show mt-5"
        role="alert"
        v-else-if="usernameIsValid"
        style="font-size: 3em; text-align: center"
      >
        사용 가능한 아이디입니다.
      </div>

      <div class="input">
        <label for="password" style="font-size: 4em; margin-top: 100px"
          >비밀번호</label
        >
        <input
          class="form-control"
          type="password"
          v-model="password"
          placeholder="비밀번호"
          style="
            font-size: 4em;
            padding: 0.5em;
            height: 1em;
            margin-top: 10px;
            margin-bottom: 20px;
          "
        />
        <input
          class="form-control"
          type="password"
          v-model="passwordConfirm"
          placeholder="비밀번호 확인"
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
        class="alert alert-warning alert-dismissible fade show mt-5"
        role="alert"
        v-if="passwordError"
        :class="{ 'error-shake-animation': isShaking }"
        style="font-size: 3em; text-align: center"
      >
        {{ passwordErrorMessage }}
      </div>

      <div class="input">
        <label for="email" style="font-size: 4em; margin-top: 100px"
          >이메일</label
        >
        <input
          class="form-control"
          type="text"
          v-model="email"
          placeholder="이메일"
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
        class="alert alert-warning alert-dismissible fade show mt-5"
        role="alert"
        v-if="emailError"
        :class="{ 'error-shake-animation': isShaking }"
        style="font-size: 3em; text-align: center"
      >
        {{ emailErrorMessage }}
      </div>

      <div class="alternative-option mt-4" style="font-size: 3em">
        이미 가입되어 있으신가요?
        <span @click="showLoginModal" style="font-size: 1.3em; cursor: pointer"
          >로그인</span
        >
      </div>
      <button
        v-if="showRegisterButton"
        @click="register"
        class="mt-4 btn-reg"
        style="font-size: 3.5em"
      >
        Register
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  data() {
    return {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
      showRegisterButton: true,
      isLoginModalVisible: false,
      emailError: false,
      emailErrorMessage: "",
      usernameError: false,
      usernameErrorMessage: "",
      passwordError: false,
      passwordErrorMessage: "",
      isShaking: false,
      usernameIsValid: false,
      usernameMessage: "",
    };
  },
  methods: {
    clearErrors() {
      this.emailError = false;
      this.emailErrorMessage = "";
      this.usernameError = false;
      this.usernameErrorMessage = "";
      this.passwordError = false;
      this.passwordErrorMessage = "";
      this.usernameIsValid = false;
      this.usernameMessage = "";
    },
    handleErrors(error) {
      this.isShaking = true;
      this.clearErrors(); // 이전 에러를 초기화

      const errorMessage = error.response.data.message;

      if (errorMessage.includes("필수 입력값이 누락되었습니다:")) {
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
      }, 3000);
    },
    showLoginModal() {
      this.$emit("close");
      this.$emit("showLogin");
      this.$emit("restoreLoginButton");
      // this.isLoginModalVisible = true;
      // this.showRegisterButton = false;
    },
    hideLoginModal() {
      this.isLoginModalVisible = false;
    },
    async checkUsername() {
      // this.isShaking = true;
      try {
        const response = await axios.get(
          `http://localhost:4000/api/auth/check`,
          {
            params: { username: this.username },
          },
          { withCredentials: true }
        );

        this.usernameError = false;
        this.usernameIsValid = true;
        this.usernameMessage = response.data.message;
      } catch (error) {
        console.error("Error checking username availability:", error);
        this.handleErrors(error);
      }
    },
  },

  async register() {
    console.log("1");
    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/signup",
        {
          username: this.username,
          password: this.password,
          passwordConfirm: this.passwordConfirm,
          email: this.email,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Registration error:", error);
      this.handleErrors(error);
    }
  },
};
</script>

<style>
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
  width: 1500px;
}

.modal-content {
  max-height: calc(100% - 48px);
  width: calc(100% - 48px);
  max-width: calc(100% - 48px);
  margin: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.input {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.input > label {
  text-align: start;
}

.input > input {
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100px !important;
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
  top: -10%;
  left: 50%;
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

.btn-reg:active {
  transform: translate(-50%, -1px);
}
.btn-check:active {
  transform: translate(-50%, -1px);
}

.alternative-option {
  text-align: center;
}

.alternative-option > span {
  color: #0e9448;
  cursor: pointer;
}

.alert {
  font-size: 0.9rem;

  margin-bottom: -73px;
  margin-top: 1rem;
}
</style>
