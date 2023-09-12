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
            @click="openPassword"
            v-show="!passwordExpanded"
          >
            비밀번호 변경
          </button>
          <button
            class="generate-button"
            type="button"
            @click="closePassword"
            v-show="passwordExpanded"
          >
            취소
          </button>
        </div>

        <div
          class="change-password"
          :style="{ height: passwordExpanded ? '800px' : '0px' }"
        >
          <p
            style="
              font-size: 3.5em;
              padding: 0.5em;
              height: 1em;
              margin-top: 50px;
              margin-left: 0px;
            "
            v-show="passwordExpanded"
          >
            - 기존 비밀번호를 통해 비밀번호 변경이 가능합니다. <br />- 영문,
            숫자를 포함하여 10자 이상 20자 이내로 사용이 가능합니다.
          </p>
          <div class="change-pw" v-show="passwordExpanded">
            <input
              class="change-password-input"
              type="password"
              v-model="originPassword"
              v-show="passwordExpanded"
              placeholder="기존 비밀번호"
            />
            <div
              class="alert-password alert-warning alert-dismissible fade show error-shake-animation"
              role="alert"
              v-if="passwordError"
              v-show="passwordExpanded"
              :class="{ 'error-shake-animation': isShaking }"
              style="font-size: 60px; text-align: center"
            >
              <div class="error-message">
                {{ passwordErrorMessage }}
              </div>
            </div>
            <div
              class="alert_correct alert-success alert-dismissible fade show"
              role="alert"
              v-if="passwordIsValid"
              v-show="passwordExpanded"
              style="font-size: 3em; text-align: center"
            >
              비밀번호 변경이 완료되었습니다.
            </div>
            <input
              class="change-password-input"
              type="password"
              v-model="newPassword"
              v-show="passwordExpanded"
              placeholder="새 비밀번호"
            />
            <input
              class="change-password-input"
              type="password"
              v-model="newPasswordConfirm"
              v-show="passwordExpanded"
              placeholder="새 비밀번호 확인"
            />
            <button
              class="generate-button"
              type="button"
              @click="showFindPassword"
              v-show="passwordExpanded"
              style="margin-left: 530px"
            >
              비밀번호 변경
            </button>
          </div>
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
            v-model="nickname"
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
          <div
            class="alert_username alert-warning alert-dismissible fade show error-shake-animation"
            role="alert"
            v-if="nicknameError"
            v-show="nicknameExpanded"
            :class="{ 'error-shake-animation': isShaking }"
            style="font-size: 3em; text-align: center"
          >
            <div class="error-message">
              {{ nicknameErrorMessage }}
            </div>
          </div>
          <div
            class="alert_correct alert-success alert-dismissible fade show"
            role="alert"
            v-if="nicknameIsValid"
            v-show="nicknameExpanded"
            style="font-size: 3em; text-align: center"
          >
            {{ nicknameMessage }} 으로 닉네임 변경이 완료되었습니다.
          </div>
        </div>
        <div class="info-item">
          <span class="info-label">이메일</span>
          <span class="info-value">{{ fetchedUserInfo.email }}</span>

          <button
            class="generate-button"
            type="button"
            @click="openEmail"
            v-show="!emailExpanded"
          >
            이메일 변경
          </button>
          <button
            class="generate-button"
            type="button"
            @click="closeEmail"
            v-show="emailExpanded"
          >
            취소
          </button>
        </div>
        <div
          class="change-email"
          :style="{ height: emailExpanded ? '500px' : '0px' }"
        >
          <p
            style="
              font-size: 3.5em;
              padding: 0.5em;
              height: 1em;
              margin-top: 100px;
              margin-left: 0px;
            "
            v-show="emailExpanded"
          >
            - 비밀번호 재설정, 안내 등에 사용되니 실제 사용하는 이메일로
            입력해주세요. <br />- 이메일 형식에 맞추어 입력해주세요. ex)
            user123@backtrack.com
          </p>
          <input
            class="change-input"
            type="text"
            v-model="email"
            v-show="emailExpanded"
            placeholder="이메일 입력"
          />
          <button
            class="generate-button"
            type="button"
            @click="changeEmail"
            v-show="emailExpanded"
            style="margin-left: 100px"
          >
            변경하기
          </button>
          <div
            class="alert_username alert-warning alert-dismissible fade show error-shake-animation"
            role="alert"
            v-if="emailError"
            v-show="emailExpanded"
            :class="{ 'error-shake-animation': isShaking }"
            style="font-size: 3em; text-align: center"
          >
            <div class="error-message">
              {{ emailErrorMessage }}
            </div>
          </div>
          <div
            class="alert_correct alert-success alert-dismissible fade show"
            role="alert"
            v-if="emailIsValid"
            v-show="emailExpanded"
            style="font-size: 3em; text-align: center"
          >
            {{ emailMessage }} 으로 이메일 변경이 완료되었습니다.
          </div>
        </div>
        <div class="info-item">
          <span class="info-label">현재 로그인방식</span>
          <span class="info-value">{{ this.provider }}</span>
        </div>
      </div>
    </div>
    <div class="info-delete">
      <span class="info-label"
        >탈퇴를 원하시면 회원탈퇴 버튼을 클릭해주세요.</span
      >
      <button
        style="margin-left: 480px"
        class="generate-button"
        type="button"
        @click="deleteUser"
      >
        회원탈퇴
      </button>
    </div>
    <v-dialog v-model="$store.state.showFindPasswordModal">
      <FindPassword />
    </v-dialog>
  </card>
  <card
    v-if="fetchedUserInfo"
    class="card-backtrack"
    :style="{ width: isFullScreen ? '93%' : '45%' }"
  >
    <div class="author">
      <h4 class="title">{{ fetchedUserInfo.nickname }} 님의 백킹트랙 관리</h4>
      <div class="user-info">
        <div class="info-item">
          <span class="info-label">생성된 백킹트랙 목록</span>
          <v-data-table
            :currentPage="currentPage"
            :headers="headers"
            :items="backtracks"
            :items-per-page="itemsPerPage"
            hide-default-footer
            class="elevation-1"
            style="font-size: 50px; margin-top: 100px"
            @click="showBacktrackData"
          >
            <template v-slot:bottom>
              <div class="text-center pt-2">
                <v-pagination
                  v-model="currentPage"
                  :length="pageCount"
                  @update:model-value="onPageChange"
                ></v-pagination>
              </div>
            </template>
          </v-data-table>
        </div>
      </div>
      <div class="fullscreen-button" @click="toggleFullScreen">
        <i
          :class="
            isFullScreen
              ? 'mdi mdi-arrow-collapse-right'
              : 'mdi mdi-arrow-collapse-left'
          "
        ></i>
      </div>
    </div>
  </card>
  <v-dialog v-model="$store.state.showBacktrackModal">
    <BacktrackModal />
  </v-dialog>
</template>
<script>
import Card from "./Card.vue";
import FindPassword from "../../components/Modals/findPasswordModal.vue";
import BacktrackModal from "../../components/Modals/BacktrackModal.vue";
import axios from "axios";
import * as Toast from "../../plugins/toast";
export default {
  props: ["userInfo"],
  components: {
    Card,
    FindPassword,
    BacktrackModal,
  },
  data() {
    return {
      fetchedUserInfo: null,
      fetchedBacktrackInfo: null,
      totalItems: 0,
      currentPage: 1,
      itemsPerPage: 10,
      headers: [
        {
          align: "start",
          key: "name",
          sortable: false,
        },
        { title: "No", key: "id" },
        { title: "제목", key: "title" },
        { title: "생성일자", key: "createdAt" },
      ],
      backtracks: [],
      search: "",

      provider: "Backtrack",
      passwordExpanded: false,
      password: null,
      passwordMessage: null,
      passwordIsValid: false,
      passwordError: false,
      nicknameExpanded: false,
      nickname: null,
      nicknameMessage: null,
      nicknameIsValid: false,
      nicknameError: false,
      emailExpanded: false,
      email: null,
      emailMessage: null,
      emailIsValid: false,
      emailError: false,
      isShaking: false,
      isFullScreen: false,
    };
  },
  created() {
    this.fetchUserInfo();
    this.fetchBacktrackInfo();
  },
  computed: {
    pageCount() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
  },
  methods: {
    onPageChange(newPage) {
      this.currentPage = newPage;
      this.fetchBacktrackInfo();
    },
    toggleFullScreen() {
      this.isFullScreen = !this.isFullScreen;
    },
    openPassword() {
      this.passwordExpanded = !this.passwordExpanded;
    },
    closePassword() {
      this.passwordExpanded = !this.passwordExpanded;
    },
    openNickname() {
      this.nicknameExpanded = !this.nicknameExpanded;
    },
    closeNickname() {
      this.nicknameExpanded = !this.nicknameExpanded;
    },

    async confirmAction() {
      const shouldContinue = window.confirm("정말 회원탈퇴 하시겠습니까?");
      return shouldContinue;
    },
    async showBacktrackData(event) {
      const item = event.target.textContent;
      try {
        const response = await axios.get(
          `http://localhost:4000/api/backtrack/data`,
          {
            params: {
              title: item,
            },
            withCredentials: true,
          }
        );
        const backtrackData = response.data.backtrackData;

        if (backtrackData) {
          this.$store.commit("toggleBacktrackModal", true);
          this.$store.commit("setChordData", backtrackData.backtrack);
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    },
    async deleteUser() {
      try {
        const shouldContinue = await this.confirmAction();
        if (!shouldContinue) {
          return;
        }

        const response = await axios.delete(
          `http://localhost:4000/api/mypage/`,

          {
            withCredentials: true,
          }
        );
        Toast.alertMessage("회원탈퇴가 완료되었습니다.");
        setTimeout(() => {
          this.$router.push("/");
        }, 3000);
      } catch (error) {
        console.error("Failed to delete user info:", error);
      }
    },
    async changeNickname() {
      try {
        if (this.nickname.length > 15) {
          throw "길이는 최대 15자 이내로 작성해주세요.";
        }

        if (
          /[&<>()'/"]/.test(this.nickname) ||
          /[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(this.nickname)
        ) {
          throw "이모티콘 및 일부 특수문자 사용 불가합니다.";
        }
        const response = await axios.put(
          `http://localhost:4000/api/mypage/userInfo/nickname`,
          {
            nickname: this.nickname,
          },
          {
            withCredentials: true,
          }
        );
        this.nicknameIsValid = true;
        this.nicknameMessage = response.data;
        this.$router.go();
      } catch (error) {
        console.error("Failed to fetch nickname info:", error);
        this.isShaking = true;
        this.nicknameIsValid = false;
        this.nicknameError = true;
        if (error instanceof Error) {
          this.nicknameErrorMessage = error.response.data.message;
        } else {
          this.nicknameErrorMessage = error;
        }
        setTimeout(() => {
          this.isShaking = false;
          this.nicknameError = false;
        }, 3000);
      }
    },
    openEmail() {
      this.emailExpanded = !this.emailExpanded;
    },
    closeEmail() {
      this.emailExpanded = !this.emailExpanded;
    },
    async changeEmail() {
      try {
        const emailRegex = /[^@]+@[^\.]+\..+/;
        if (!emailRegex.test(this.email)) {
          throw "이메일 형식에 맞추어 입력해주세요.";
        }
        const response = await axios.put(
          `http://localhost:4000/api/mypage/userInfo/email`,
          {
            email: this.email,
          },
          {
            withCredentials: true,
          }
        );
        this.emailIsValid = true;
        this.emailMessage = response.data;
        this.$router.go();
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        this.isShaking = true;
        this.emailIsValid = false;
        this.emailError = true;
        if (error instanceof Error) {
          this.emailErrorMessage = error.response.data.message;
        } else {
          this.emailErrorMessage = error;
        }
        setTimeout(() => {
          this.isShaking = false;
          this.emailError = false;
        }, 3000);
      }
    },
    async fetchUserInfo() {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/mypage/userInfo`,

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
    async fetchBacktrackInfo() {
      try {
        if (!this.backtracks || this.backtracks.length === 0) {
          this.fetchBacktrackPageNum();
        }
        const response = await axios.get(
          `http://localhost:4000/api/backtrack?page=${this.currentPage}`,

          {
            withCredentials: true,
          }
        );

        this.fetchedBacktrackInfo = response.data;

        this.backtracks = this.fetchedBacktrackInfo.backtrackData;
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },
    async fetchBacktrackPageNum() {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/backtrack/page`,

          {
            withCredentials: true,
          }
        );

        this.totalItems = response.data;
      } catch (error) {
        console.error("Failed to fetch BacktrackPage info:", error);
      }
    },
    async showFindPassword() {
      try {
        if (
          this.password === undefined ||
          this.newPassword === undefined ||
          this.newPasswordConfirm === undefined
        ) {
          throw "빈 칸을 모두 입력해주세요.";
        }
        const response = await axios.put(
          `http://localhost:4000/api/mypage/userInfo/password`,
          {
            password: this.originPassword,
            newPassword: this.newPassword,
            newPasswordConfirm: this.newPasswordConfirm,
          },
          {
            withCredentials: true,
          }
        );
        this.passwordIsValid = true;
        this.passwordMessage = response.data;
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        this.isShaking = true;
        this.passwordIsValid = false;
        this.passwordError = true;
        if (error instanceof Error) {
          this.passwordErrorMessage = error.response.data.message;
        } else {
          this.passwordErrorMessage = error;
        }
        setTimeout(() => {
          this.isShaking = false;
          this.passwordError = false;
        }, 3000);
      }
    },
  },
};
</script>
<style scoped>
.fullscreen-button {
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
  font-size: 70px;
}

.card-backtrack {
  transition: width 0.3s;
  position: absolute;
  /* top: 0; */
  right: 370px;
  /* bottom: 0; */

  z-index: 99;
  width: 2750px;
  flex-direction: row-reverse;
}

.error-shake-animation {
  animation: shake 0.5s;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}
.card-user {
  overflow: hidden;
  width: 2750px;
}
.author {
  margin-top: 20px;
  padding: 120px 100px;
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
.info-delete {
  padding: 120px 100px;
  position: absolute;
  margin-top: 550px;

  border-top: 1px solid #ccc;
  align-items: flex-end;
  color: rgb(124, 123, 122);
}

.info-label {
  display: inline-block;
  min-width: 600px;
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

.change-password-input {
  font-size: 70px;
  border: 1px solid #ccc;
  margin-top: 40px;
  margin-left: 200px;
  padding: 20px 200px;
  text-align: center;
  position: relative;
}
.change-pw {
  margin-top: 200px;
}
.change-input {
  font-size: 70px;
  border: 1px solid #ccc;
  margin-top: 200px;
  margin-left: 350px;
  padding: 20px 200px;
  text-align: center;
}
.alert-password {
  position: absolute;
  top: 870px;
  left: 1700px;
  background: none;
  color: rgb(43, 4, 234);
}
::v-deep
  .v-table
  .v-table__wrapper
  > table
  > tbody
  > tr:not(:last-child)
  > td:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}

::v-deep .v-data-table__td .v-data-table-column--align-start {
  max-width: 10px;
}
</style>
