<template>
  <card v-if="fetchedUserInfo" class="card-user">
    <div class="author">
      <h4 class="title">기본 회원정보</h4>
      <div class="user-info">
        <div class="info-item">
          <span class="info-label">아이디</span>
          <span class="info-value">{{ fetchedUserInfo.username }} </span>

          <button
            class="generate-button"
            type="button"
            @click="showFindPassword"
          >
            비밀번호 재설정
          </button>
        </div>

        <div class="info-item">
          <span class="info-label">닉네임</span>
          <span class="info-value">{{ fetchedUserInfo.nickname }}</span>

          <button
            class="generate-button"
            type="button"
            @click="openNickname"
            v-show="!nicknameExpanded"
          >
            닉네임 변경
          </button>
          <button
            class="generate-button"
            type="button"
            @click="closeNickname"
            v-show="nicknameExpanded"
          >
            취소
          </button>
        </div>
        <div
          class="change-nickname"
          :style="{ height: nicknameExpanded ? '500px' : '0px' }"
        >
          <p
            style="
              font-size: 3.5em;
              padding: 0.5em;
              height: 1em;
              margin-top: 100px;
              margin-left: 0px;
            "
            v-show="nicknameExpanded"
          >
            - 길이는 최대 15자 이내로 작성해주세요. <br />- 이모티콘 및 일부
            특수문자 사용 불가합니다. &&lt;>()'/"
          </p>
          <input
            class="change-input"
            type="text"
            v-model="newNickname"
            v-show="nicknameExpanded"
            placeholder="닉네임 입력 (최대 15자)"
          />
          <button
            class="generate-button"
            type="button"
            @click="changeNickname"
            v-show="nicknameExpanded"
            style="margin-left: 100px"
          >
            변경하기
          </button>
        </div>
        <div class="info-item">
          <span class="info-label">이메일</span>
          <span class="info-value">{{ fetchedUserInfo.email }}</span>

          <button
            class="generate-button"
            type="button"
            @click="generateBacktrack"
          >
            이메일 변경
          </button>
        </div>
        <div class="info-item">
          <span class="info-label">현재 로그인방식</span>
          <span class="info-value">{{ this.provider }}</span>
        </div>
      </div>
    </div>
    <v-dialog v-model="$store.state.showFindPasswordModal">
      <FindPassword />
    </v-dialog>
  </card>
</template>
<script>
import Card from "src/components/Cards/Card.vue";
import FindPassword from "../../components/LoginModal/findPasswordModal.vue";
import axios from "axios";
export default {
  props: ["userInfo"],
  components: {
    Card,
    FindPassword,
  },
  data() {
    return {
      username: this.$store.state.loggedInUsername,
      fetchedUserInfo: null,
      provider: "Backtrack",
      nicknameExpanded: false,
    };
  },
  created() {
    this.fetchUserInfo();
  },
  methods: {
    openNickname() {
      this.nicknameExpanded = !this.nicknameExpanded;
    },
    closeNickname() {
      this.nicknameExpanded = !this.nicknameExpanded;
    },
    async changeNickname() {
      this.nicknameExpanded = !this.nicknameExpanded;
      try {
        const response = await axios.put(
          `http://localhost:4000/api/mypage/userInfo`,
          {
            withCredentials: true,
          }
        );

        this.fetchedUserInfo = response.data;
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },
    async fetchUserInfo() {
      try {
        await this.$store.dispatch("fetchTokenData");
        const response = await axios.get(
          `http://localhost:4000/api/mypage/userInfo?username=${this.$store.state.loggedInUsername}`,
          {
            withCredentials: true,
          }
        );
        this.provider = localStorage.getItem("oauth");
        this.fetchedUserInfo = response.data;
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },
    async showFindPassword() {
      this.$store.commit("toggleFindPasswordModal", true);
    },
  },
};
</script>
<style scoped>
.card-user {
  overflow: hidden;
  width: 2750px;
}
.author {
  margin-top: 20px;
  padding: 50px 100px;
}

.title {
  font-size: 90px;
  margin-bottom: 80px;
  font-weight: 500;
}

.user-info {
  /* border-top: 1px solid #ccc; */
  margin-top: 150px;
  margin-bottom: 100px;
}

.info-item {
  position: relative;
  margin-top: 100px;
  margin-bottom: 10px;
  border-top: 1px solid #ccc;
}

.info-label {
  display: inline-block;
  width: 600px;
  font-size: 75px;
  font-weight: 400;
  margin-top: 70px;
}

.info-value {
  display: inline-block;
  font-size: 70px;
  width: 1250px;
  margin-left: 10px;
}
.generate-button {
  border: 1px solid #ccc;
  padding: 20px 0px;
  width: 600px;
  display: inline-block;

  font-size: 70px;
}
.change-input {
  font-size: 70px;
  border: 1px solid #ccc;
  margin-top: 200px;
  margin-left: 350px;
  padding: 20px 200px;
}
</style>
