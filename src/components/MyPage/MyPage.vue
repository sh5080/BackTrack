<template>
  <div class="mypage">
    <div class="sidebar">
      <div class="category-menu">
        <div @click="selectedCategory = 'main'">메인</div>
      </div>

      <div class="category-menu">
        <div @click="selectedCategory = 'profile'">프로필 수정</div>
      </div>
      <div class="category-menu">
        <div @click="selectedCategory = 'account'">계정 설정</div>
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedCategory: "main", // 초기 선택된 카테고리
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
  border: 10px solid rgb(223, 202, 125);
  /* border-radius: 50px; */
  /* background: #fbe577; */
  /* margin-top: 20px; */
  /* margin-bottom: 20px; */
}
</style>
