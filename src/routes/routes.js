import { createRouter, createWebHistory } from "vue-router";
import DashboardLayout from "../layout/DashboardLayout.vue";
import NotFound from "../pages/NotFoundPage.vue";
import LoginModal from "src/components/Modals/LoginModal.vue";
import UserProfile from "src/pages/UserProfile.vue";
import TableList from "src/pages/TableList.vue";
import Admin from "src/pages/Admin.vue";
import Icons from "src/pages/Icons.vue";
import Questions from "src/pages/Questions.vue";
import Backtrack from "src/pages/BacktrackGenerator.vue";
import { store } from "../store/index";
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
        redirect: "",
      },
      {
        path: "table-list",
        name: "Table List",
        component: TableList,
      },
      {
        path: "/admin",
        name: "Admin",
        component: Admin,
      },
      {
        path: "icons",
        name: "Icons",
        component: Icons,
      },

      {
        path: "/questions",
        name: "Questions",
        component: Questions,
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
import axios from "axios";

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
          errorMessage.includes("제목은 20자 이내")
        ) {
        } else if (errorMessage.includes("유효하지 않은")) {
          store.dispatch("resetState");
          router.push("/login");
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        } else {
          store.dispatch("resetState");
          router.push("/login");
          alert("비정상적인 접근입니다.");
        }
      }
    }
    return Promise.reject(error);
  }
);
