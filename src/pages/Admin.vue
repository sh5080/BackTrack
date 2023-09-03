<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card v-if="isAdmin" class="card-user">
            <div class="author">
              <h4 class="title">{{ this.nickname }}님의 관리자 페이지</h4>
              <div class="user-info">
                <!-- <div class="info-item">
                  <span class="info-label">회원 관리</span>
                  <span class="info-value">{{}}</span>

                  <button
                    class="generate-button"
                    type="button"
                    @click="openUser"
                    v-show="!userExpanded"
                  >
                    닉네임 변경
                  </button>
                  <button
                    class="generate-button"
                    type="button"
                    @click="closeUser"
                    v-show="userExpanded"
                  >
                    취소
                  </button>
                </div>
                <div
                  class="change-user"
                  :style="{ height: userExpanded ? '500px' : '0px' }"
                >
                  <p
                    style="
                      font-size: 3.5em;
                      padding: 0.5em;
                      height: 1em;
                      margin-top: 100px;
                      margin-left: 0px;
                    "
                    v-show="userExpanded"
                  >
                    - 길이는 최대 15자 이내로 작성해주세요. <br />- 이모티콘 및
                    일부 특수문자 사용 불가합니다. &&lt;>()'/"
                  </p>
                  <input
                    class="change-input"
                    type="text"
                    v-model="user"
                    v-show="userExpanded"
                    placeholder="닉네임 입력 (최대 15자)"
                  />
                  <button
                    class="generate-button"
                    type="button"
                    @click="changeuser"
                    v-show="userExpanded"
                    style="margin-left: 100px"
                  >
                    변경하기
                  </button>
                  <div
                    class="alert_username alert-warning alert-dismissible fade show error-shake-animation"
                    role="alert"
                    v-if="userError"
                    v-show="userExpanded"
                    :class="{ 'error-shake-animation': isShaking }"
                    style="font-size: 3em; text-align: center"
                  >
                    <div class="error-message">
                      {{ userErrorMessage }}
                    </div>
                  </div>
                  <div
                    class="alert_correct alert-success alert-dismissible fade show"
                    role="alert"
                    v-if="userIsValid"
                    v-show="userExpanded"
                    style="font-size: 3em; text-align: center"
                  >
                    {{ userMessage }} 으로 닉네임 변경이 완료되었습니다.
                  </div>
                </div> -->
                <div class="info-item">
                  <span class="info-label">팝업 관리</span>
                  <span class="info-value">{{}}</span>

                  <button
                    class="generate-button"
                    type="button"
                    @click="openPopup"
                    v-show="!popupExpanded"
                  >
                    열기
                  </button>
                  <button
                    class="generate-button"
                    type="button"
                    @click="closePopup"
                    v-show="popupExpanded"
                  >
                    취소
                  </button>
                </div>
                <div
                  class="change-popup"
                  :style="{ height: popupExpanded ? '1250px' : '0px' }"
                >
                  <p
                    style="
                      font-size: 3.5em;
                      padding: 0.5em;
                      height: 1em;
                      margin-top: 100px;
                      margin-left: 0px;
                    "
                    v-show="popupExpanded"
                  >
                    - 팝업을 통해 공지할 수 있습니다.
                  </p>
                  <textarea
                    class="description-input"
                    type="text"
                    v-model="description"
                    v-show="popupExpanded"
                    placeholder="팝업에 들어갈 글을 작성하세요."
                  ></textarea>
                  <input
                    class="file-input"
                    type="file"
                    ref="fileInput"
                    @change="handleFileUpload"
                    v-show="popupExpanded"
                  />
                  <!-- <div v-if="popupPreview">
                    <h3>미리보기</h3>
                    <img :src="selectedImageURL" alt="미리보기 이미지" />
                    <p>{{ description }}</p>
                  </div> -->
                  <button
                    class="upload-button"
                    type="button"
                    @click="showPreview"
                    v-show="popupExpanded"
                    style="margin-left: 50px"
                  >
                    미리보기
                  </button>
                  <button
                    class="upload-button"
                    type="button"
                    @click="uploadImage"
                    v-show="popupExpanded"
                    style="margin-left: 20px"
                  >
                    업로드
                  </button>

                  <div v-if="imageUploaded">이미지 업로드 완료!</div>
                  <div
                    class="alert_username alert-warning alert-dismissible fade show error-shake-animation"
                    role="alert"
                    v-if="popupError"
                    v-show="popupExpanded"
                    :class="{ 'error-shake-animation': isShaking }"
                    style="font-size: 3em; text-align: center"
                  >
                    <div class="error-message">
                      {{ popupErrorMessage }}
                    </div>
                  </div>
                  <v-dialog
                    v-model="$store.state.showPopupPreviewModal"
                    :selectedImageURL="selectedImageURL"
                    :popupText="description"
                    persistent=""
                  >
                    <PopupPreview />
                  </v-dialog>
                  <div
                    class="alert_correct alert-success alert-dismissible fade show"
                    role="alert"
                    v-if="popupIsValid"
                    v-show="popupExpanded"
                    style="font-size: 3em; text-align: center"
                  >
                    {{ popupMessage }} 으로 이메일 변경이 완료되었습니다.
                  </div>
                </div>
                <div class="info-item">
                  <span class="info-label">현재 로그인방식</span>
                  <span class="info-value">{{ this.provider }}</span>
                </div>
              </div>
            </div>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Card from "./UserProfile/Card.vue";
import PopupPreview from "../components/Modals/PopupPreviewModal.vue";
import axios from "axios";

export default {
  components: {
    Card,
    PopupPreview,
  },
  computed: {
    isAdmin() {
      return !!this.$store.state.isAdmin;
    },
  },
  data() {
    return {
      nickname: this.$store.state.loggedInNickname,
      // userExpanded: false,
      // user: null,
      // userMessage: null,
      // userIsValid: false,
      // userError: false,
      description: "",
      popupExpanded: false,
      popup: null,
      popupMessage: null,
      popupIsValid: false,
      popupError: false,
      isShaking: false,
      selectedFile: null,
      imageUploaded: false,
      popupPreview: false,
      selectedImageURL: "",

      //
      result: null,
    };
  },

  methods: {
    openPopup() {
      this.popupExpanded = !this.popupExpanded;
    },
    closePopup() {
      this.popupExpanded = !this.popupExpanded;
    },
    handleFileUpload() {
      this.selectedFile = this.$refs.fileInput.files[0];
      this.selectedImageURL = URL.createObjectURL(this.selectedFile);
    },
    uploadImage() {
      const formData = new FormData();
      formData.append("image", this.selectedFile);

      this.imageUploaded = true;
    },
    showPreview() {
      this.$store.commit("togglePopupPreviewModal", true);
    },
    async postPopup() {
      try {
        const response = await axios.post(
          `http://localhost:4000/api/admin/popup`,
          {
            description: this.description,
            images: this.selectedFile,
          },

          {
            withCredentials: true,
          }
        );

        this.result = response.data;
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },
  },
};
</script>
<style scoped>
.card-user {
  overflow: hidden;
  width: 2750px;
  max-height: 5000px;
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
.upload-button {
  border: 1px solid #ccc;
  padding: 20px 0px;
  width: 450px;
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
.file-input {
  font-size: 70px;
  border: 1px solid #ccc;
  margin-top: 100px;
  margin-left: 20px;
  padding: 20px 200px;
  text-align: center;

  width: 1470px;
}

.description-input {
  font-size: 70px;
  border: 1px solid #ccc;
  margin-top: 100px;
  margin-left: 20px;
  width: 2440px;
  height: 800px;
  padding: 50px;
  resize: vertical;
}
.alert-password {
  position: absolute;
  top: 870px;
  left: 1700px;
  background: none;
  color: rgb(43, 4, 234);
}
</style>
