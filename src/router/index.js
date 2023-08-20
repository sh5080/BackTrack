import { createRouter, createWebHistory } from "vue-router";
import Admin from "../components/MyPage/myAdmin.vue";
import RegisterModal from "../components/LoginModal/RegisterModal.vue";
import RegisterSuccessModal from "../components/LoginModal/RegisterSuccessModal.vue";
import Backtrack from "../components/BacktrackGenerator.vue";
import MyPage from "../components/MyPage/MyPage.vue";
import MyMain from "../components/MyPage/myMain.vue";
import MyProfile from "../components/MyPage/myProfile.vue";
import { createStore } from "vuex";

export const store = createStore({
  state: {
    isAuthenticated: false,
    sessionData: null,
    userId: null,
    loggedInUsername: null,
    provider: null,
    showLoginModal: false,
    showRegisterModal: false,
    showRegisterSuccessModal: false,
    showFindUsernameModal: false,
    showFindPasswordModal: false,
    showGoogleLoginModal: false,
    showKakaoLoginModal: false,
  },
  mutations: {
    setAuthenticated(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
    },
    setSessionData(state, sessionData) {
      state.sessionData = sessionData;
      if (sessionData) {
        state.isAuthenticated = true;
      }
    },
    setUserId(state, userId) {
      state.userId = userId;
    },

    setIsAdmin(state, isAdmin) {
      if (isAdmin) {
        state.isAdmin = true;
      }
    },
    setLoggedInUsername(state, username) {
      state.loggedInUsername = username;
    },
    setLoginProvider(state, value) {
      state.provider = value;
    },
    toggleLoginModal(state, value) {
      state.showLoginModal = value;
    },
    toggleRegisterModal(state, value) {
      state.showRegisterModal = value;
    },
    toggleRegisterSuccessModal(state, value) {
      state.showRegisterSuccessModal = value;
    },
    toggleFindUsernameModal(state, value) {
      state.showFindUsernameModal = value;
    },
    toggleFindPasswordModal(state, value) {
      state.showFindPasswordModal = value;
    },
    toggleGoogleLoginModal(state, value) {
      state.showGoogleLoginModal = value;
    },
    toggleKakaoLoginModal(state, value) {
      state.showKakaoLoginModal = value;
    },
  },

  actions: {
    async fetchSessionData({ commit, state }) {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/auth/getSessionData?userId=${state.userId}`,
          {
            withCredentials: true,
          }
        );

        const sessionData = response.data;

        if (sessionData) {
          commit("setAuthenticated", true);
          commit("setSessionData", sessionData);
        }

        return sessionData;
      } catch (error) {
        console.error("Error fetching session data:", error);
        return null;
      }
    },
    async resetState({ commit }) {
      commit("setAuthenticated", false);
      commit("setSessionData", null);
      commit("setUserId", null);
      commit("setIsAdmin", false);
      commit("setLoggedInUsername", null);
      commit("setLoginProvider", null);
      commit("toggleLoginModal", false);
      commit("toggleRegisterModal", false);
      commit("toggleRegisterSuccessModal", false);
      commit("toggleFindUsernameModal", false);
      commit("toggleFindPasswordModal", false);
      commit("toggleGoogleLoginModal", false);
      commit("toggleKakaoLoginModal", false);
      // 다른 상태도 초기화하는 코드 추가
    },
  },
});

const routes = [
  {
    path: "/home",
    name: "home",
    component: Backtrack,
    children: [
      { path: "", redirect: "backtrack" },
      { path: "/category/:categoryName", component: Backtrack },
    ],
  },
  {
    path: "/backtrack",
    name: "backtrack",
    component: Backtrack,
  },
  {
    path: "/login",
    name: "login",
    beforeEnter: (to, from, next) => {
      store.commit("toggleLoginModal", true);
      next(false);
    },
  },

  {
    path: "/signup",
    name: "register",
    component: RegisterModal,
  },
  {
    path: "/success",
    name: "success",
    component: RegisterSuccessModal,
  },

  {
    path: "/mypage",
    component: MyPage,
    meta: { authRequired: true },
    children: [
      { path: "", redirect: "main" },
      { path: "/main", component: MyMain },
      { path: "/profile", component: MyProfile },
      { path: "/admin", component: Admin },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userId = store.state.userId;

  if (userId) {
    store.dispatch("fetchSessionData", userId).then((sessionData) => {
      if (sessionData) {
        store.commit("setAuthenticated", true);
      } else {
        store.commit("setAuthenticated", false);
      }
      next();
    });
  } else {
    store.commit("setAuthenticated", false);
    next();
  }
});

import axios from "axios";
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response.data.message.includes("접근 거부") ||
      error.response.data.message.includes("사용자")
    ) {
      store.dispatch("resetState");

      alert("로그인이 필요합니다.");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);
