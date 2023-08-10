<template>
  <div id="content" class="container" style="">
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
            margin-bottom: 100px;
          "
        />
      </div>
      <div
        class="alert alert-warning alert-dismissible fade show mt-5 d-none"
        role="alert"
        id="alert_1"
        style="font-size: 3em; text-align: center"
      ></div>
      <div class="alternative-option mt-4" style="font-size: 3em">
        회원이 아니신가요?
        <span @click="moveToRegister" style="font-size: 1.5em; cursor: pointer"
          >회원가입</span
        >
      </div>
      <button
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

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
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

        // 백엔드에서 반환된 데이터 처리
        if (response.data.success) {
          this.$router.push("/");
        }
      } catch (error) {
        console.error("Error logging in:", error);
        // 로그인 실패 시에만 아래 코드가 실행됩니다.
        let alert_1 = document.querySelector("#alert_1");
        if (alert_1) {
          alert_1.classList.remove("d-none");
          alert_1.innerHTML = "아이디 혹은 비밀번호를 확인해주세요.";
        } else {
          console.error("Alert element not found.");
        }
      }
    },
    moveToRegister() {
      console.log("1");
      this.$router.push("/signup");
    },
  },
};
</script>

<style>
#content {
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

.container {
  width: 1500px !important;
  height: 1800px;
  max-width: 95%;
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
}

.alternative-option > span {
  color: #0e9448;
  cursor: pointer;
}

#sign_out {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>
