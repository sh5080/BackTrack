<template>
  <div class="mypage">
    <div class="content">
      <div>
        <h1>마이페이지</h1>
        <p>{{ $store.state.loggedInUsername }}님의 정보:</p>
        <ul>
          <div>아이디: {{ $store.state.loggedInUsername }}</div>
          <div>이메일: {{ userEmail }}</div>
        </ul>
      </div>
      <div class="category-content">
        <div v-if="selectedCategory === 'profile'">프로필 수정 내용...</div>
        <div v-if="selectedCategory === 'account'">계정 설정 내용...</div>
        <!-- 다른 카테고리 컨텐츠들을 추가해주세요 -->
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedCategory: "profile", // 초기 선택된 카테고리
    };
  },
  methods: {
    closeAllModals() {
      this.$store.commit("toggleLoginModal", false);
      //   this.$store.commit("toggleRegisterModal", false);
      //   this.$store.commit("toggleRegisterSuccessModal", false);
    },
  },
};
</script>

<style scoped>
.mypage {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 800px;
  background-color: #f0f0f0;
  padding: 20px;
  border: 1px solid lightgray;
  border-radius: 50px;
  margin-top: 100px;
  margin-left: 30px;
}

.content {
  font-size: 80px;
  padding: 20px;
  border: 1px solid lightgray;
  border-radius: 5px;
  background: #fefefe;
  margin-top: 100px;
  /* margin-left: 100px; */
}
.category-menu {
  font-size: 80px;
  padding: 50px;
  /* border: 1px solid rgb(223, 202, 125); */
  border-radius: 50px;
  background: #fbe577;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
