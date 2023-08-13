import { createRouter, createWebHistory } from "vue-router";
import LoginModal from "../components/LoginModal.vue";
import RegisterModal from "../components/RegisterModal.vue";
import MainModal from "../components/BacktrackGenerator.vue";
import { createStore } from "vuex";

export const store = createStore({
  state: {
    isAuthenticated: false,
    loggedInUsername: null,
    showLoginModal: false,
    showRegisterModal: false,
    showRegisterSuccessModal: false,
  },
  mutations: {
    setAuthenticated(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
    },
    setLoggedInUsername(state, username) {
      state.loggedInUsername = username;
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
  },
});

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginModal,
  },
  { path: "/", name: "main", component: MainModal },
  {
    path: "/signup",
    name: "register",
    component: RegisterModal,
  },
];

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.authRequired)) {
    const isAuthenticated = store.state.isAuthenticated;
    if (isAuthenticated) {
      next();
    } else {
      alert("You must be logged in to access this area");
      router.push("/");
    }
  } else {
    next();
  }
});
