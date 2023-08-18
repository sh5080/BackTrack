<template>
  <header
    class="input-group"
    style="
      /* background-color: #faf8f8; */
      /* border: 1px solid #ccc; */
      font-size: 80px;
      padding: 0px;
      margin-top: 50px;
      margin-bottom: 50px;
    "
  >
    <v-row style="align-items: center">
      <v-col cols="1" style="display: flex; justify-content: flex-start">
        <div class="logo-button-container" @click="goToBacktrack">
          <img
            src="../assets/mainlogo1.png"
            alt="Backtrack"
            style="
              margin-left: 100px;
              width: 400%;
              height: auto;
              max-width: 800px;
              display: block;
            "
          />
        </div>
      </v-col>
      <v-col
        cols="11"
        style="display: flex; margin-left: -30px; justify-content: flex-end"
      >
        <div class="auth-container">
          <div class="welcome-message" v-if="$store.state.isAuthenticated">
            {{ $store.state.loggedInUsername }}님 환영합니다.
          </div>

          <button
            class="button-container"
            style="font-size: 80px"
            v-show="!$store.state.isAuthenticated"
            @click="openLoginModal"
          >
            로그인
          </button>

          <div v-if="$store.state.isAuthenticated">
            <button
              style="margin-right: 15px"
              @click="openMyPage"
              class="button-container"
            >
              마이페이지
            </button>
          </div>
          <div v-if="$store.state.isAuthenticated">
            <button @click="logout" class="button-container">로그아웃</button>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="$store.state.showLoginModal">
      <Login @closeLogin="closeLoginModal" />
    </v-dialog>
  </header>
</template>

<script>
import Login from "@/components/LoginModal.vue";
import axios from "axios";
import { mapMutations } from "vuex";
export default {
  components: {
    Login,
  },
  async created() {
    const params = new URLSearchParams(window.location.search);
    const loggedInUsername = params.get("username");
    const provider = params.get("provider");
    if (loggedInUsername) {
      this.setAuthenticated(true);
      this.$store.commit("setLoggedInUsername", loggedInUsername);
      this.$store.commit("setLoginProvider", provider);

      this.$router.push("/");
    }
  },
  methods: {
    goToBacktrack() {
      this.$router.push("/");
    },
    openLoginModal() {
      this.$store.commit("toggleLoginModal", true);
    },
    closeLoginModal() {
      this.$store.commit("toggleLoginModal", false);
    },
    openMyPage() {
      this.$router.push("/myPage");
    },
    ...mapMutations(["setAuthenticated"]),
    async logout() {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/auth/logout"
        );
        if (response.data.message === "로그아웃 되었습니다.") {
          this.setAuthenticated(false);
          this.$store.commit("setLoggedInUsername", null);
          this.$router.push("/");
        }
      } catch (error) {
        console.error("Error during logout:", error);
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.button-container {
  display: flex;
  margin-top: 10px;
  color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  background: linear-gradient(to top, #00b869, #03c75a);
}
.logo-button {
  display: inline-block;
  transition: transform 0.2s, filter 0.2s;
}

.logo-button:hover {
  transform: scale(1.05);
}

.logo-button-container {
  display: inline-block;
  position: relative;
  max-width: 800px;
  cursor: pointer;
}

.welcome-message {
  display: flex;
  margin-top: 15px;
  margin-right: 25px;
  align-items: center;
}
</style>
