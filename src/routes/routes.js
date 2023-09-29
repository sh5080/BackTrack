import { createRouter, createWebHistory } from "vue-router";
import DashboardLayout from "../layout/DashboardLayout.vue";
// import DashboardContent from "../layout/Content.vue";
import NotFound from "../pages/NotFoundPage.vue";
import Main from "src/pages/Main.vue";
import UserProfile from "src/pages/UserProfile.vue";
import Community from "src/pages/Community.vue";
import Admin from "src/pages/Admin.vue";
import Board from "src/pages/Board.vue";
import Icons from "src/pages/Icons.vue";
import Questions from "src/pages/Questions.vue";
import Backtrack from "src/pages/BacktrackGenerator.vue";
import { store } from "../store/index";
export const routes = [
  {
    path: "/",
    name: "Main",
    component: DashboardLayout,
    children: [
      {
        path: "main",
        name: "Main",
        component: Main,
      },
      {
        path: "backtrack",
        name: "Backtrack",
        component: Backtrack,
      },
      {
        path: "user",
        name: "User",
        component: UserProfile,
      },
      {
        path: "board",
        name: "Board",
        component: Board,
      },

      {
        path: "community",
        name: "Community",
        component: Community,
      },

      {
        path: "icons",
        name: "Icons",
        component: Icons,
      },
      {
        path: "questions",
        name: "Questions",
        component: Questions,
      },
      {
        path: "admin",
        name: "Admin",
        component: Admin,
      },
    ],
  },
  // ... 나머지 라우터 설정 ...
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "nav-item active",
});

router.beforeEach((to, from, next) => {
  const userId = store.state.userId;

  //로그인할 때 세션 조회

  store.dispatch("fetchSessionData").then((sessionData) => {
    if (sessionData) {
      store.commit("setAuthenticated", true);
      localStorage.setItem("isLogin", true);
    } else {
      store.commit("setAuthenticated", false);
      localStorage.removeItem("isLogin");
    }
    next();
  });

  next();
});

router.afterEach((to) => {
  const componentName = to.name;
  if (componentName) {
    const componentId = componentName;
    const componentData = document.querySelector(`#${componentId}`);
    if (componentData) {
      const yOffset = componentData.getBoundingClientRect().top;
      window.scrollBy({ top: yOffset - 270, behavior: "smooth" });
    }
  }
});

import axios from "axios";
let alerted = false;
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      const errorMessage = error.response.data.message;
      if (errorMessage) {
        console.log("Error response:", errorMessage);
        if (
          errorMessage.includes("필수 입력값") ||
          errorMessage.includes("비밀번호가 일치하지 않습니다.") ||
          errorMessage.includes("코드") ||
          errorMessage.includes("마디") ||
          errorMessage.includes("없는 사용자") ||
          errorMessage.includes("새로운") ||
          errorMessage.includes("간편로그인") ||
          errorMessage.includes("새 비밀번호와 비밀번호 확인이") ||
          errorMessage.includes("제목은 20자 이내") ||
          errorMessage.includes("닉네임") ||
          errorMessage.includes("아이디") ||
          errorMessage.includes("백킹트랙") ||
          errorMessage.includes("게시글")
        ) {
          alerted = false;
        } else if (errorMessage.includes("유효하지 않은")) {
          store.dispatch("resetState");
          store.dispatch("loginState");
          if (!alerted) {
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            alerted = true;
          }
        } else if (errorMessage.includes("유효한 토큰을 제공")) {
          store.dispatch("resetState");
          store.dispatch("loginState");
        } else {
          store.dispatch("resetState");
          store.dispatch("loginState");
          if (!alerted) {
            alert("비정상적인 접근입니다.");
            alerted = true;
          }
        }
      }
    }
    return Promise.reject(error);
  }
);
