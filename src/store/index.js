import { createStore } from "vuex";
import socket from "./socket";
import axios from "axios";

export const store = createStore({
  state: {
    isAuthenticated: false,
    isAdmin: false,
    loggedInNickname: null,
    activeUsers: null,
    activeReceiver: null,
    chatData: null,
    showLoginModal: false,
    showRegisterModal: false,
    showRegisterSuccessModal: false,
    showFindUsernameModal: false,
    showFindPasswordModal: false,
    showGoogleLoginModal: false,
    showKakaoLoginModal: false,
    showBacktrackSuccessModal: false,
    showBacktrackModal: false,
    showPopupPreviewModal: false,
    chordData: null,
    bpm: 60,
    isAudioPlaying: false,
    previewData: {
      description: "",
      imageURL: "",
    },

    //

    likedPosts: [],
    showLikedPostModal: false,
    showMyPostModal: false,
    showPostModal: false,
    currentPost: null,
    currentPostAuthor: null,
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
    toggleBacktrackModal(state, value) {
      state.showBacktrackModal = value;
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
    setBacktrackData(state, value) {
      state.backtrackData = value;
    },
    setBpm(state, bpm) {
      state.bpm = bpm;
    },
    setPreviewData(state, data) {
      state.previewData = data;
    },
    addActiveUserByServer(state, data) {
      state.activeUsers = data;
    },
    clearActiveUser(state) {
      state.activeUsers = null;
    },
    addReceiver(state, user) {
      state.activeReceiver = user;
    },
    setChatData(state, chat) {
      state.chatData = chat;
    },
    setLikes(state, value) {
      state.likedPosts = value;
    },
    setPostData(state, post) {
      state.currentPost = post;
    },
    setPostAuthor(state, author) {
      state.currentPostAuthor = author;
    },
    updateLikedPosts(state, postId) {
      if (state.likedPosts) {
        const index = state.likedPosts.indexOf(postId);
        if (index !== -1) {
          state.likedPosts.splice(index, 1);
        } else {
          state.likedPosts.push(postId);
        }
      }
    },
    toggleShowLikedPostModal(state, value) {
      state.showLikedPostModal = value;
    },
    toggleShowMyPostModal(state, value) {
      state.showMyPostModal = value;
    },
    toggleShowPostModal(state, value) {
      state.showPostModal = value;
    },
  },

  actions: {
    startChat({ commit }, { sender, receiver }) {
      commit("addActiveUserByServer", { sender, receiver });
    },
    endChat({ commit }) {
      commit("clearActiveUser");
    },

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
    async loginState({ commit }) {
      commit("toggleLoginModal", true);
    },

    async resetState({ commit }) {
      commit("setIsAdmin", false);
      // commit("toggleLoginModal", false);
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
    isAdmin(state) {
      return state.isAdmin;
    },
  },
});
