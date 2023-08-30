<template>
  <v-dialog v-model="$store.state.showBacktrackSuccessModal" persistent="">
    <div class="backtrack-success-modal">
      <h2 class="mb-3" style="font-size: 6em; margin-top: 400px">
        <div v-if="isLogged">
          {{ $store.state.loggedInNickname }} 님의 백킹트랙
        </div>
      </h2>

      <div style="font-size: 3em; margin-top: 100px">
        백킹트랙이 생성되었습니다. <br />만들어진 백킹트랙을 재생 및 저장할 수
        있습니다.
      </div>
      <div class="sheet-music">
        <!-- 악보 내용 -->
      </div>

      <button
        type="button"
        @click="closeAllModals"
        class="btn-success"
        style="font-size: 3.5em"
      >
        확인
      </button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    isLogged() {
      return !!this.$store.state.loggedInNickname;
    },
  },

  methods: {
    closeAllModals() {
      this.$store.commit("toggleBacktrackSuccessModal", false);
    },
    async sheetMusic() {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/backtrack",
          {
            bpm: this.selectedBpm,
            backtrack: this.backtrack,
          },
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Error to create Backtrack in:", error);
      }
    },
  },
};
</script>

<style scoped>
.backtrack-success-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid lightgray;
  padding: 4rem 4rem;
  border-radius: 5px;
  background: #fefefe;
  width: 3000px;
  min-height: 2000px;
  text-align: center;
}

.backtrack-success-modal h2 {
  font-size: 6em;
  margin-top: 400px;
  margin-bottom: 1rem;
}

.backtrack-success-modal div {
  font-size: 3em;
  margin-top: 100px;
  margin-bottom: 2rem;
}

.sheet-music {
  width: 100%; /* 너비 조절 */
  min-height: 1000px; /* 높이 조절 */
  background-color: #f0f0f0; /* 배경색 설정 */
  margin-top: 50px; /* 원하는 여백 설정 */
  padding: 20px; /* 내부 여백 설정 */
  font-size: 2em; /* 글자 크기 설정 */
  text-align: center; /* 가운데 정렬 설정 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* 그림자 설정 */
}

.btn-success {
  position: relative;
  left: 50%;
  padding: 1em 2.5em;
  font-size: 3.5em;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 700;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  transform: translateX(-50%);
}

.btn-success:hover {
  background-color: #155724;
  box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
  color: #fff;
  transform: translate(-50%, -7px);
}

.btn-success:active {
  transform: translate(-50%, -1px);
}
</style>
