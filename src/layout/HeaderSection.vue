<template>
  <header class="input-group">
    <v-row style="align-items: center; justify-content: flex-end">
      <v-col cols="1" style="display: flex; justify-content: flex-start">
        <div class="logo-button-container" @click="goToBacktrack">
          <img
            src="/img/mainlogo2.png"
            alt="Backtrack"
            style="
              margin-left: 50px;
              width: 400%;
              height: auto;
              max-width: 800px;
              display: block;
            "
          />
        </div>
      </v-col>
      <v-col cols="11" style="display: flex; justify-content: flex-end">
        <div class="auth-container">
          <div class="welcome-message" v-if="$store.state.isAuthenticated">
            {{ $store.state.loggedInNickname }}님 환영합니다.
          </div>

          <button
            class="button-container"
            style="font-size: 80px"
            v-show="!$store.state.isAuthenticated"
            @click="openLoginModal"
          >
            로그인
          </button>

          <div v-if="$store.state.isAdmin">
            <button
              style="margin-right: 15px"
              @click="openAdmin"
              class="button-container"
            >
              어드민
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
import Login from "../components/Modals/LoginModal.vue";
import { mapMutations } from "vuex";
export default {
  components: {
    Login,
  },
  data() {
    return {
      nickname: null,
    };
  },
  async created() {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get("provider");

    if (provider) {
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
    openAdmin() {
      this.$router.push("/admin");
    },
    ...mapMutations(["setAuthenticated"]),
    async logout() {
      try {
        const response = await this.$axios.delete("/api/auth/logout", {
          withCredentials: true,
        });
        if (response.data.message === "로그아웃 되었습니다.") {
          await this.$store.dispatch("resetState");
          this.$router.go();
        }
      } catch (error) {
        console.error("Error during logout:", error);
      }
    },
  },
};
</script>

<style scoped>
.input-group {
  background-color: #fff;
  font-size: 80px;
  padding: 30px;
  margin-left: 325px;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 93%;
  box-shadow: 0px 20px 20px rgba(0, 0, 0, 0.1);
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
}
.categories {
  display: flex;
  gap: 0px;
  width: 100%;
  padding: 0px 400px;
  margin-bottom: 40px;
  justify-content: space-between;
  /* background: linear-gradient(to top, #00b869, #03c75a); */
}

.auth-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 50px;
}
.button-container {
  display: flex;
  margin-top: 10px;
  color: #fff;
  padding: 10px 40px;
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
.v-row {
  justify-content: flex-end;
}
</style>
