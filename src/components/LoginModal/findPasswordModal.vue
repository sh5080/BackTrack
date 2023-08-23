<template>
  <div id="content" class="container">
    <form
      @submit.prevent="findPassword"
      style="margin-left: 10px"
      autocomplete="off"
    >
      <h2 class="mb-3" style="position: relative; top: 50px; font-size: 6em">
        비밀번호 재설정
      </h2>
      <p
        style="
          font-size: 3.5em;
          padding: 0.5em;
          height: 1em;
          margin-top: 100px;
          margin-bottom: 200px;
          margin-left: 0px;
          text-align: center;
        "
      >
        가입할 때 입력한 아이디, 이메일로 비밀번호를 초기화하고,
        <br />임시비밀번호를 이메일로 보내드립니다.<br />
        임시비밀번호로 로그인한 뒤 바로 비밀번호를 변경해주세요.
      </p>
      <div class="input">
        <input
          class="form-control"
          type="text"
          name="username"
          placeholder="아이디"
          v-model="username"
          style="font-size: 4em; padding: 0.5em; height: 1em; margin-top: 100px"
        />
      </div>
      <div class="input">
        <input
          class="form-control"
          type="text"
          name="email"
          placeholder="이메일"
          v-model="email"
          style="font-size: 4em; padding: 0.5em; height: 1em"
        />
      </div>

      <div
        class="alert_correct alert-success alert-dismissible fade show"
        role="alert"
        v-if="isValid"
        style="font-size: 3em; text-align: center"
      >
        <!-- {{ alertMessage }} -->
        <span v-html="alertMessage"></span>
      </div>

      <div
        class="findPassword-error-alert alert-warning alert-dismissible fade show mt-5"
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
        style="font-size: 3.5em"
      >
        비밀번호 초기화
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
          @click="OpenFindUsernameModal"
          style="font-size: 1.3em; margin-right: 00px; cursor: pointer"
          >아이디 찾기</span
        >

        <span
          @click="hideFindPasswordModal"
          style="font-size: 1.3em; margin-left: -300px; cursor: pointer"
        >
          로그인</span
        >
      </div>
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
      errorAlert: false,
      isShaking: false,

      errorMessage: "",
      alertMessage: "",
      isValid: false,
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
        this.errorMessage = "빈 칸을 모두 입력해주세요.";
      } else if (errorMessage) {
        this.errorAlert = true;
        this.errorMessage = errorMessage;
      }

      setTimeout(() => {
        this.isShaking = false;
        this.clearErrors();
      }, 3000);
    },
    OpenFindUsernameModal() {
      this.$store.commit("toggleFindUsernameModal", true);
      this.$store.commit("toggleFindPasswordModal", false);
    },

    hideFindPasswordModal() {
      this.$store.commit("toggleFindPasswordModal", false);
    },

    async findPassword(submitEvent) {
      this.isValid = false;
      this.errorAlert = false;
      this.username = submitEvent.target.elements.username.value;
      this.email = submitEvent.target.elements.email.value;
      if (!this.username) {
        this.username = undefined;
      }
      if (!this.email) {
        this.email = undefined;
      }
      try {
        const response = await axios.post(
          `http://localhost:4000/api/auth/Pw/${this.email}`,
          { username: this.username },
          { withCredentials: true }
        );
        const message = response.data.message;

        this.isValid = true;
        this.alertMessage = message + "</br>새로운 비밀번호로 로그인해주세요.";
      } catch (error) {
        console.error("비밀번호 재설정 중 오류:", error);
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
  /* z-index: 9996; */
}

.input {
  display: flex;
  flex-direction: column;
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
  margin-top: 150px;
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
  margin-top: 200px;
}

.alternative-option > span {
  color: #0e9448;
  cursor: pointer;
}
.alert_correct,
.findPassword-error-alert {
  font-size: 0.9rem;
  margin-bottom: -100px;
}
</style>
