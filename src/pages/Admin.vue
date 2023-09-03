<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card v-if="isAdmin" class="card-user">
            <div class="author">
              <h4 class="title">관리자 페이지</h4>
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
                  :style="{ height: popupExpanded ? '1700px' : '0px' }"
                >
                  <p
                    style="
                      font-size: 3.5em;
                      padding: 0.5em;
                      height: 1em;
                      margin-bottom: 100px;
                      margin-left: 0px;
                    "
                    v-show="popupExpanded"
                  >
                    - 팝업을 통해 공지할 수 있습니다.
                  </p>
                  <div class="editor" v-show="popupExpanded">
                    <quillEditor
                      theme="snow"
                      :options="editorOptions"
                      v-model:content="description"
                      contentType="html"
                      placeholder="팝업에 들어갈 글을 작성하세요."
                    ></quillEditor>
                  </div>

                  <!-- <div v-if="popupPreview">
                    <h3>미리보기</h3>
                    <img :src="selectedImageURL" alt="미리보기 이미지" />
                    <p>{{ description }}</p>
                  </div> -->
                  <div style="text-align: right">
                    <input
                      class="file-input"
                      type="file"
                      ref="fileInput"
                      @change="handleFileUpload"
                      v-show="popupExpanded"
                    />
                    <button
                      class="upload-button"
                      type="button"
                      @click="resetImage"
                      v-show="popupExpanded"
                      style="margin-left: 20px"
                    >
                      초기화
                    </button>
                    <button
                      class="upload-button"
                      type="button"
                      @click="showPreview"
                      v-show="popupExpanded"
                      style="margin-left: 50px"
                    >
                      미리보기
                    </button>
                  </div>
                  <div
                    class="alert_username alert-warning alert-dismissible fade show error-shake-animation"
                    role="alert"
                    v-if="fileSizeExceeded"
                    v-show="popupExpanded"
                    :class="{ 'error-shake-animation': isShaking }"
                    style="font-size: 3em; text-align: center"
                  >
                    <div class="error-message">
                      파일 크기가 너무 큽니다. {{ maxFileSize / 1024 }}KB 이하의
                      파일을 선택해주세요.
                    </div>
                  </div>

                  <div style="text-align: right">
                    <button
                      class="register-button"
                      type="button"
                      @click="postPopup"
                      v-show="popupExpanded"
                      style=""
                    >
                      업로드
                    </button>
                  </div>

                  <v-dialog
                    v-model="$store.state.showPopupPreviewModal"
                    :selectedImageURL="selectedImageURL"
                    :description="description"
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
import * as Toast from "../plugins/toast";
import { mapActions } from "vuex";
import { QuillEditor } from "@vueup/vue-quill";
// import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "../plugins/vue-quill.snow.css";
import { ref } from "vue";

export default {
  components: {
    Card,
    PopupPreview,
    QuillEditor,
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
      editorOptions: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
          ],
        },
      },
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
      maxFileSize: 1024 * 1024,
      fileSizeExceeded: false,
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
    resetImage() {
      this.updatePreviewData({
        imageURL: null,
      });

      this.selectedFile = null;
      this.selectedImageURL = null;
    },
    // handleFileUpload() {
    //   this.selectedFile = this.$refs.fileInput.files[0];
    //   this.selectedImageURL = URL.createObjectURL(this.selectedFile);
    // },
    handleFileUpload() {
      const fileInput = this.$refs.fileInput;
      const selectedFile = fileInput.files[0];

      // 파일 크기 확인
      if (selectedFile) {
        if (selectedFile.size > this.maxFileSize) {
          this.fileSizeExceeded = true;
          fileInput.value = "";
        } else {
          this.fileSizeExceeded = false;
          this.selectedFile = selectedFile; // 파일 크기가 제한 이내인 경우 선택한 파일 저장
          this.selectedImageURL = URL.createObjectURL(selectedFile);
        }
      }
    },
    ...mapActions(["updatePreviewData", "togglePopupPreviewModal"]),
    showPreview() {
      this.$store.commit("togglePopupPreviewModal", true);
      this.updatePreviewData({
        description: this.description,
        imageURL: this.selectedImageURL,
      });
    },
    async postPopup() {
      try {
        const requestData = {
          description: this.description,
          image: this.selectedFile ? this.selectedFile : null,
        };

        if (this.selectedFile) {
          const formData = new FormData();
          formData.append("description", this.description);
          formData.append("image", this.selectedFile);

          const response = await axios.post(
            `http://localhost:4000/api/admin/popup`,
            formData,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          this.result = response.data;
        } else {
          const response = await axios.post(
            `http://localhost:4000/api/admin/popup`,
            requestData,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          this.result = response.data;
        }
        Toast.alertMessage("팝업 설정이 완료되었습니다.");
        this.$router.go();
      } catch (error) {
        console.error("Failed to post popup:", error);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
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

.register-button {
  // margin-right: 47px;
  border: 1px solid #ccc;
  padding: 20px 0px;
  width: 450px;
  display: inline-block;
  margin-top: 30px;
  font-size: 70px;
  background-color: aliceblue;
}
.upload-button {
  border: 1px solid #ccc;
  padding: 20px 0px;
  width: 450px;
  display: inline-block;
  margin-top: 120px;
  font-size: 70px;
}
.register-button:hover,
.upload-button:hover,
.generate-button:hover {
  background-color: #f0eded;
}

.change-password-input {
  font-size: 70px;
  border: 1px solid #ccc;
  margin-top: 40px;
  margin-left: 200px;
  // padding: 20px 200px;
  text-align: center;
  position: relative;
}
.change-pw {
  margin-top: 200px;
}
.editor {
  height: 1000px;
}
.file-input {
  font-size: 65px;
  border: 1px solid #ccc;
  margin-top: 100px;
  // margin-left: 20px;
  padding: 20px 200px;
  text-align: center;

  width: 1530px;
}

.alert-password {
  position: absolute;
  top: 870px;
  left: 1700px;
  background: none;
  color: rgb(43, 4, 234);
}
</style>
