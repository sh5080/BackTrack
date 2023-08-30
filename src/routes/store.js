import { createStore } from "vuex";
import axios from "axios";
export const store = createStore({
  state: {
    isAuthenticated: false,
    loggedInUsername: null,
    loggedInNickname: null,
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
    setIsAdmin(state, isAdmin) {
      if (isAdmin) {
        state.isAdmin = true;
      }
    },
    setLoggedInUsername(state, username) {
      state.loggedInUsername = username;
    },
    setLoggedInNickname(state, nickname) {
      state.loggedInNickname = nickname;
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
    async fetchSessionData({ commit }) {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/auth/getSessionData`,
          {
            withCredentials: true,
          }
        );

        const nickname = response.data.nickname;
        const role = response.data.role;
        if (role === "ADMIN") {
          commit("setIsAdmin", true);
        }
        if (nickname) {
          commit("setAuthenticated", true);
          commit("setLoggedInNickname", nickname);
        }
        return nickname;
      } catch (error) {
        console.error("Error fetching session data:", error);
        return null;
      }
    },
    async resetState({ commit }) {
      commit("toggleLoginModal", false);
      commit("toggleRegisterModal", false);
      commit("toggleRegisterSuccessModal", false);
      commit("toggleFindUsernameModal", false);
      commit("toggleFindPasswordModal", false);
      commit("toggleGoogleLoginModal", false);
      commit("toggleKakaoLoginModal", false);
      localStorage.removeItem("isLogin");
      localStorage.removeItem("n_id");
      localStorage.removeItem("oauth");
      // 다른 상태도 초기화하는 코드 추가
    },
  },
});
