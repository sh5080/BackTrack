<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card v-if="isAdmin" class="card-user">
            <div class="author">
              <h4 class="title">관리자 페이지</h4>
              <div class="user-info">
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

                  <div style="text-align: right">
                    <input
                      class="file-input"
                      type="file"
                      ref="fileInput"
                      @change="handleFileUpload"
                      v-show="popupExpanded"
                      accept="image/*"
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

                  <div class="flex-container" v-show="popupExpanded">
                    <v-select
                      :items="items"
                      :disabled="isDisabled"
                      label="팝업 다시보기"
                      v-show="popupExpanded"
                    ></v-select>

                    <v-checkbox
                      @click="toggleSelect"
                      v-show="popupExpanded"
                    ></v-checkbox>
                    <button
                      class="register-button"
                      type="button"
                      @click="postPopup"
                      v-show="popupExpanded"
                    >
                      업로드
                    </button>
                  </div>

                  <v-dialog
                    v-model="$store.state.showPopupPreviewModal"
                    :selectedImageURL="selectedImageURL"
                    :description="description"
                  >
                    <PopupPreview />
                  </v-dialog>
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
import Card from "./Card/Card.vue";
import PopupPreview from "../components/Modals/PopupPreviewModal.vue";
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
      items: [
        "해당사항 없음",
        "3일 뒤 다시보기",
        "7일 뒤 다시보기",
        "30일 뒤 다시보기",
      ],
      isDisabled: true,
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
    toggleSelect() {
      this.isDisabled = !this.isDisabled;
    },
    openPopup() {
      this.popupExpanded = !this.popupExpanded;
    },
    closePopup() {
      this.popupExpanded = !this.popupExpanded;
    },
    resetImage() {
      if (this.selectedImageURL) {
        URL.revokeObjectURL(this.selectedImageURL);
      }

      this.selectedImageURL = null;
      this.updatePreviewData({
        imageURL: "",
      });
      this.selectedFile = null;
      const fileInput = this.$refs.fileInput;
      if (fileInput) {
        fileInput.value = null;
      }
    },
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
          const response = await this.$axios.post(
            `/api/admin/popup`,
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
          const response = await this.$axios.post(
            `/api/admin/popup`,
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
.flex-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
:deep(.v-input__control),
:deep(.v-input__details) {
  // margin-top: 20px;
  width: 800px;
  // font-size: 80px;
}

:deep(.v-select .v-field .v-field__input > input),
:deep(.v-label) {
  width: 800px;
  font-size: 50px;
}

:deep(.v-select .v-select__selection-text) {
  margin-top: 50px;
  font-size: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:deep(.v-field--variant-filled) {
  --v-input-control-height: 150px;
  --v-field-padding-bottom: 100px;
}
:deep(.v-select .v-select__selection),
:deep(.v-btn .v-btn--elevated) {
  width: 800px;
  font-size: 100px;
}
:deep(.v-checkbox) {
  width: 800px;
  height: 100px;
  font-size: 70px;
}

:deep(.v-field.v-field--appended) {
  --v-field-padding-end: 6px;
  font-size: 100px;
}
</style>
