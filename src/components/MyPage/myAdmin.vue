<template>
  <div class="admin">
    <h2>관리자 페이지</h2>
    <form @submit.prevent="createCategory">
      <label for="categoryName">카테고리 이름:</label>
      <input v-model="categoryName" type="text" id="categoryName" required />

      <label for="categoryImage">카테고리 이미지:</label>
      <v-file-input
        v-model="categoryImage"
        accept="image/*"
        id="categoryImage"
        required
      />

      <button type="submit">카테고리 생성</button>
      <router-view></router-view>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryName: "",
      categoryImage: null,
    };
  },
  methods: {
    createCategory() {
      // 여기서 카테고리 생성 로직을 구현하세요.
      // this.categoryName와 this.categoryImage를 사용해서 백엔드로 데이터 전송 등을 할 수 있습니다.
      // 예를 들면 axios를 사용해서 API 호출을 할 수 있습니다.
    },
  },
};
</script>

<style>
.admin {
  max-width: 2000px;
  /* margin: 0 auto; */
}
</style>
