<template>
  <router-view></router-view>
</template>

<script>
import { mapState } from "vuex";

// export default {
//   computed: {
//     ...mapState(["isLoggedIn"]),
//   },
//   created() {
//     const isLogin = localStorage.getItem("isLogin");
//     if (isLogin === "true") {
//       this.$store.dispatch("fetchTokenData");
//     }
//   },
// };
export default {
  created() {
    this.checkAuthentication();
  },
  methods: {
    async checkAuthentication() {
      const isLogin = localStorage.getItem("isLogin");
      const isNickname = localStorage.getItem("n_id");
      if (isLogin === "true") {
        try {
          const nickname = await this.$store.dispatch("fetchSessionData");
          if (!nickname) {
            throw "유효하지 않은 세션입니다. 다시 로그인해주세요.";
          }
          this.$store.commit("setLoggedInNickname", nickname);
        } catch (error) {
          console.error("Error checking authentication:", error);
        }
      }
    },
  },
};
</script>

<style>
body {
  margin: 0;
}

#app {
  width: 100%;
  margin: 0 auto;
}
.mosha__toast__content-wrapper > span > svg {
  width: 70px;
}

.vue-notifyjs.notifications {
  .list-move {
    transition: transform 0.3s, opacity 0.4s;
  }
  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter-active {
    transition: transform 0.2s ease-in, opacity 0.4s ease-in;
  }
  .list-leave-active {
    transition: transform 1s ease-out, opacity 0.4s ease-out;
  }

  .list-enter {
    opacity: 0;
    transform: scale(1.1);
  }
  .list-leave-to {
    opacity: 0;
    transform: scale(1.2, 0.7);
  }
}
</style>
