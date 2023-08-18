import { createRouter, createWebHistory } from "vue-router";
import LoginModal from "../components/LoginModal/LoginModal.vue";
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
    loggedInUsername: null,
    provider: "Backtrack",
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
      { path: "/main", component: MyMain }, // 메인 페이지 카테고리
      { path: "/profile", component: MyProfile }, // 프로필 수정 카테고리
      // 다른 카테고리에 대한 라우터 추가
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   if (to.matched.some((record) => record.meta.authRequired)) {
//     const isAuthenticated = store.state.isAuthenticated;
//     if (isAuthenticated) {
//       next();
//     } else {
//       alert("로그인 후 접근 가능합니다.");
//       router.push("/");
//     }
//   } else {
//     next();
//   }
// });

import axios from "axios";
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response.data.message.includes("접근 거부") ||
      error.response.data.message.includes("사용자")
    ) {
      store.commit("setAuthenticated", false);
      store.commit("setLoggedInUsername", false);
      store.commit("setLoginProvider", false);

      alert("로그인이 필요합니다.");
      router.push("/login");

      // store.commit("toggleLoginModal", true);
    }
    return Promise.reject(error);
  }
);
