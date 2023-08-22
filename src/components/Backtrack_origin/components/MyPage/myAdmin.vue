<template>
  <div class="admin">
    <h2>관리자 페이지</h2>
    메인 사이드바 카테고리 생성
    <form>
      <label for="categoryName">카테고리 이름:</label>
      <input v-model="categoryName" type="text" id="categoryName" required />

      <button type="button" @click="createCategory">카테고리 생성</button>
      <router-view></router-view>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import * as Toast from "../../plugins/toast";
export default {
  data() {
    return {
      categoryName: "",
    };
  },
  methods: {
    async createCategory() {
      try {
        const categoryName = this.categoryName;
        const response = await axios.post(
          "http://localhost:4000/api/admin/categories",
          {
            name: this.categoryName,
          },
          { withCredentials: true }
        );
        console.log(categoryName);
        // 서버로부터의 응답 처리
        if (response.status === 200) {
          // 카테고리 생성 성공 시 추가 작업
        }
      } catch (error) {
        // 에러 처리
        console.error("Error creating category:", error);
        Toast.customError("비정상적인 접근입니다. 개발자에게 문의하세요.");
      }
    },
  },
};
</script>

<style>
.admin {
  max-width: 2000px;
}
</style>
