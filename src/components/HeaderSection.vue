<template>
  <header
    class="input-group"
    style="
      /* background-color: #faf8f8; */
      /* border: 1px solid #ccc; */
      font-size: 80px;
      padding: 0px;
      margin-top: 120px;
      margin-bottom: 0px;
    "
  >
    <v-row style="align-items: center">
      <v-col cols="1" style="display: flex; justify-content: flex-start">
        <div class="logo-button-container" @click="goToBacktrack">
          <img
            src="../assets/mainlogo1.png"
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
    <v-row style="align-items: center">
      <!-- 로고 부분 -->
      <!-- ... -->

      <!-- 카테고리 부분 -->
      <v-col cols="12" style="display: flex; margin-top: 80px">
        <!-- ... -->
        <div class="categories">
          <router-link
            v-for="category in categories"
            :key="category.id"
            :to="`/category/${category.name}`"
            class="category-item"
          >
            <div class="category-content">
              <img :src="category.image" alt="Category Image" />
              <span>{{ category.name }}</span>
            </div>
          </router-link>
        </div>
      </v-col>
    </v-row>
  </header>
</template>

<script>
import Login from "@/components/LoginModal/LoginModal.vue";
import axios from "axios";
import { mapMutations } from "vuex";
export default {
  components: {
    Login,
  },
  data() {
    return {
      currentCategory: "main",
      categories: [
        {
          id: 1,
          name: "backtrack",
          image: "../assets/category_icon1.png",
        },
        { id: 2, name: "카테고리1" },
        { id: 3, name: "카테고리2" },
      ],
    };
  },
  async created() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");
    const username = params.get("username");
    const provider = params.get("provider");

    if (userId) {
      // this.setAuthenticated(true);
      this.$store.commit("setUserId", userId);
      this.$store.commit("setLoggedInUsername", username);

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
          await this.$store.dispatch("resetState");
          this.$router.push("/");
          delete this.$store.state.isAdmin;
        }
      } catch (error) {
        console.error("Error during logout:", error);
      }
    },
  },
};
</script>

<style scoped>
.categories {
  display: flex;
  gap: 0px;
  width: 100%;
  padding: 0px 400px;
  margin-bottom: 40px;
  justify-content: space-between;
  /* background: linear-gradient(to top, #00b869, #03c75a); */
}
.category-item {
  /* flex-grow: 1; */
  display: inline-block;
  border: 8px solid #ebe9e9;
  border-radius: 120px;
  padding: 20px 30px;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  color: black;
  font-size: 60px;
}
.category-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.category-item img {
  margin-top: 30px;
}
.auth-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
</style>
