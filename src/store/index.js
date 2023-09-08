import { createStore } from "vuex";
import socket from "./socket";
import axios from "axios";

export const store = createStore({
  state: {
    isAuthenticated: false,
    isAdmin: false,
    loggedInNickname: null,
    showLoginModal: false,
    showRegisterModal: false,
    showRegisterSuccessModal: false,
    showFindUsernameModal: false,
    showFindPasswordModal: false,
    showGoogleLoginModal: false,
    showKakaoLoginModal: false,
    showBacktrackSuccessModal: false,
    showPopupPreviewModal: false,
    chordData: null,
    bpm: 60,
    isAudioPlaying: false,
    previewData: {
      description: "",
      imageURL: "",
    },

    //
    backtrackModalData: null,
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
    setLoggedInNickname(state, nickname) {
      state.loggedInNickname = nickname;
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
    toggleBacktrackSuccessModal(state, value) {
      state.showBacktrackSuccessModal = value;
    },
    togglePopupPreviewModal(state, value) {
      state.showPopupPreviewModal = value;
    },
    setChordData(state, value) {
      state.chordData = value;
    },
    setAudioPlaying(state, value) {
      state.isAudioPlaying = value;
    },
    //
    setBacktrackModalData(state, value) {
      state.backtrackModalData = value;
    },
    setBpm(state, bpm) {
      state.bpm = bpm;
    },
    setPreviewData(state, data) {
      state.previewData = data;
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
    selectBpm({ commit }, bpm) {
      commit("setBpm", bpm);
    },
    updatePreviewData({ commit }, data) {
      commit("setPreviewData", data);
    },

    async resetState({ commit }) {
      commit("setIsAdmin", false);
      commit("toggleLoginModal", false);
      commit("toggleRegisterModal", false);
      commit("toggleRegisterSuccessModal", false);
      commit("toggleFindUsernameModal", false);
      commit("toggleFindPasswordModal", false);
      commit("toggleGoogleLoginModal", false);
      commit("toggleKakaoLoginModal", false);
      commit("toggleBacktrackSuccessModal", false);
      localStorage.removeItem("isLogin");
      localStorage.removeItem("oauth");
      // 다른 상태도 초기화하는 코드 추가
    },
  },
  modules: {
    socket,
  },
  getters: {
    getPreviewData: (state) => state.previewData,
  },
});
