import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import axios from "axios";
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
  plugins: [
    createPersistedState({
      paths: ["isAuthenticated", "loggedInUsername", "isAdmin"],
    }),
  ],

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
    async fetchTokenData({ commit }) {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/auth/isAuth`,
          {
            withCredentials: true,
          }
        );
        // const username = response.data;
        commit("setAuthenticated", true);
        // commit("setLoggedInUsername", username);
      } catch (error) {
        console.error("Error fetching token data:", error);
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
      localStorage.removeItem("isLogin");
      // 다른 상태도 초기화하는 코드 추가
    },
  },
});
