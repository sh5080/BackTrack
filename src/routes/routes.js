import { createRouter, createWebHistory } from "vue-router";
import DashboardLayout from "../layout/DashboardLayout.vue";
import NotFound from "../pages/NotFoundPage.vue";
import Overview from "src/pages/Overview.vue";
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
      error.response.data.message.includes("접근 거부")
      //  ||error.response.data.message.includes("사용자")
    ) {
      store.dispatch("resetState");

      alert("로그인이 필요합니다.");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);
