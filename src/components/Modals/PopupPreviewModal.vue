<template>
  <div class="popup-modal">
    <div class="popup-content">
      <h3>팝업 미리보기</h3>
      <img :src="selectedImageURL" alt="미리보기 이미지" />
      <p>{{ description }}</p>
      <button @click="closeModal">닫기</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedImageURL: String,
    description: String,
  },
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
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  width: 2000px;
  height: 2500px;
}
</style>
