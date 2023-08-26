import { createRouter, createWebHistory } from "vue-router";
import DashboardLayout from "../layout/DashboardLayout.vue";
import NotFound from "../pages/NotFoundPage.vue";
import LoginModal from "src/components/LoginModal/LoginModal.vue";
import UserProfile from "src/pages/UserProfile.vue";
import TableList from "src/pages/TableList.vue";
import Typography from "src/pages/Typography.vue";
import Icons from "src/pages/Icons.vue";
import Notifications from "src/pages/Notifications.vue";
import Backtrack from "src/pages/BacktrackGenerator.vue";
import { store } from "./store";
export const routes = [
  // {
  //   path: "/",
  //   component: DashboardLayout,
  //   redirect: "",
  // },
  {
    path: "/",
    component: DashboardLayout,
    redirect: "",
    children: [
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
        path: "table-list",
        name: "Table List",
        component: TableList,
      },
      {
        path: "typography",
        name: "Typography",
        component: Typography,
      },
      {
        path: "icons",
        name: "Icons",
        component: Icons,
      },

      {
        path: "notifications",
        name: "Notifications",
        component: Notifications,
      },
    ],
  },
  {
    path: "/main",
    name: "main",
    component: DashboardLayout,
    redirect: "",
  },
  {
    path: "/login",
    name: "login",
    component: LoginModal,
    redirect: "",
  },
  // { path: "/:pathMatch(.*)*", component: NotFound },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "nav-item active",
  scrollBehavior: (to) => {
    if (to.hash) {
      return { el: to.hash };
    } else {
      return { top: 0, left: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const userId = store.state.userId;

  //로그인할 때 세션 조회
  if (userId) {
    store.dispatch("fetchSessionData", userId).then((sessionData) => {
      if (sessionData) {
        store.commit("setAuthenticated", true);
        localStorage.setItem("isLogin", true);
      } else {
        store.commit("setAuthenticated", false);
        localStorage.removeItem("isLogin");
      }
      next();
    });
  } else {
    next();
  }
});

import axios from "axios";
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config.noAlert) {
      return Promise.reject(error);
    }

    if (error.response && error.response.data) {
      console.log("Error response:", error.response);
      if (
        error.response.data.message.includes("접근 거부") ||
        error.response.data.message.includes("사용자 정보")
      ) {
        store.dispatch("resetState");
        localStorage.removeItem("isLogin");

        router.push("/login");
        alert("로그아웃 되었습니다.");
      } else if (
        error.response.data.message.includes("필수 입력값") ||
        error.response.data.message.includes("비밀번호가 일치하지 않습니다.")
      ) {
      } else {
        store.dispatch("resetState");
        localStorage.removeItem("isLogin");

        router.push("/login");
        alert("비정상적인 접근입니다.");
      }
    }
    return Promise.reject(error);
  }
);
