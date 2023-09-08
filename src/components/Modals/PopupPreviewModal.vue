<template>
  <div class="popup-modal">
    <div class="popup-content">
      <h3 style="font-size: 100px; text-align: left; padding: 70px">
        팝업 미리보기
      </h3>

      <v-img
        :width="2000"
        aspect-ratio="1/1"
        cover
        :src="previewData.imageURL"
        alt="미리보기 이미지"
      ></v-img>
      <div v-html="previewData.description" class="quill-content"></div>
      <div>
        <v-btn class="close-btn" @click="closeModal">닫기</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import "../../plugins/vue-quill.snow.css";
export default {
  computed: {
    ...mapGetters(["getPreviewData"]),
    previewData() {
      return this.getPreviewData;
    },
  },
  //   props: ["previewData"],
  methods: {
    closeModal() {
      this.$store.commit("togglePopupPreviewModal", false);
    },
  },
};
</script>

<style scoped>
/* 모달 스타일링 */
.popup-modal {
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  width: 2000px;
  height: 2500px;
}
.quill-content {
  box-sizing: border-box;
  line-height: 1.42;
  height: 100%;
  max-height: 800px;
  outline: none;
  overflow-y: auto;
  padding: 24px 30px;
  tab-size: 4;
  -moz-tab-size: 4;
  text-align: start;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-right: 200px;
}

.close-btn {
  position: absolute;
  border: 1px solid #ccc;
  padding: 20px 0px;
  width: 450px;
  display: inline-block;
  top: 1000px;
  right: 1000px;
  height: 120px;
  /* margin-top: 120px; */

  font-size: 70px;
}
</style>
