<template>
  <div class="mypage">
    <div class="sidebar">
      <div class="category-menu" @click="selectedCategory('main')">
        회원 정보
      </div>
      <div class="category-menu" @click="selectedCategory('profile')">
        프로필 수정
      </div>
      <div class="category-menu" @click="selectedCategory('backingtrack')">
        백킹 트랙
      </div>
      <div class="category-menu" @click="selectedCategory('env')">환경설정</div>
    </div>
    <div class="content">
      <router-view :selectedCategory="currentCategory" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentCategory: "main", // 초기 선택된 카테고리
    };
  },
  methods: {
    selectedCategory(category) {
      this.currentCategory = category;
      this.$router.push(`/${category}`); // 해당 카테고리에 따라 URL 변경
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
  /* border: 10px solid rgb(223, 202, 125); */
  cursor: pointer;
  /* border-radius: 50px; */
  background: linear-gradient(to top, #00b869, #03c75a);

  /* margin-top: 20px; */
  /* margin-bottom: 20px; */
}
</style>
