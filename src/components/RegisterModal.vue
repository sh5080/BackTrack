<template>
  <div id="content" class="container">
    <form @submit.prevent="register" style="margin-left: 10px">
      <h2 class="modal-title" style="font-size: 6em">회원가입</h2>
      <div class="input">
        <label for="username" style="font-size: 4em; margin-top: 100px"
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
        class="alert alert-warning alert-dismissible fade show mt-5 d-none"
        role="alert"
        id="alert_username"
        style="font-size: 3em; text-align: center"
      ></div>
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
      </div>
      <div
        class="alert alert-warning alert-dismissible fade show mt-5 d-none"
        role="alert"
        id="alert_password"
        style="font-size: 3em; text-align: center"
      ></div>
      <div class="input">
        <label for="email" style="font-size: 4em; margin-top: 100px"
          >이메일 (아이디, 비밀번호를 찾을 때 사용됩니다.)</label
        >
        <input
          class="form-control"
          type="text"
          v-model="email"
          placeholder="email@address.com"
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
        class="alert alert-warning alert-dismissible fade show mt-5 d-none"
        role="alert"
        id="alert_email"
        style="font-size: 3em; text-align: center"
      ></div>
      <div class="alternative-option mt-4" style="font-size: 3em">
        이미 가입되어 있으신가요?
        <span @click="moveToLogin" style="font-size: 1.3em; cursor: pointer"
          >Login</span
        >
      </div>

      <button type="submit" class="mt-4 btn-pers" style="font-size: 3.5em">
        Register
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
      email: "",
      password: "",
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/auth/signup",
          {
            username: this.username,
            password: this.password,
            email: this.email,
          },
          { withCredentials: true }
        );
        console.log(response.data);
        // this.$router.push("/");
      } catch (error) {
        console.error("Registration error:", error);
        if (
          error.response.data.message.includes("필수 입력값이 누락되었습니다:")
        ) {
          let alert_email = document.querySelector("#alert_email");
          alert_email.classList.remove("d-none");
          alert_email.innerHTML = "빈 칸을 모두 입력해주세요.";
          console.log(alert_email);
        } else if (error.response.data.message.includes("아이디")) {
          let alert_username = document.querySelector("#alert_username");
          alert_username.classList.remove("d-none");
          alert_username.innerHTML = error.response.data.message;
          console.log(alert_username);
        } else if (error.response.data.message.includes("비밀번호")) {
          let alert_password = document.querySelector("#alert_password");
          alert_password.classList.remove("d-none");
          alert_password.innerHTML = error.response.data.message;
          console.log(alert_password);
        } else {
          let alert_2 = document.querySelector("#alert_email");
          alert_2.classList.remove("d-none");
          alert_2.innerHTML = error.response.data.message;
          console.log(alert_2);
        }
      }
    },
    moveToLogin() {
      this.$router.push("/");
    },
  },
};
</script>

<style>
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

.alert {
  font-size: 0.9rem;
  margin-top: 1rem;
}
</style>
