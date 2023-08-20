<template>
  <div class="mypage">
    <div class="sidebar">
      <!-- <div class="category-menu" @click="selectedCategory('main')">
        회원 정보
      </div> -->
      <div
        class="category-menu"
        @click="toggleCategory('main')"
        :class="{ open: isCategoryOpen('main') }"
      >
        회원 정보
      </div>

      <!-- <div class="category-menu" @click="selectedCategory('profile')">
        프로필 수정
      </div> -->

      <div v-if="isCategoryOpen('main')" class="category-sub-menu">
        <div
          class="category-sub-menu-item"
          @click="selectedCategory('profile')"
        >
          프로필 수정
        </div>
      </div>
      <div class="category-menu" @click="selectedCategory('backingtrack')">
        백킹 트랙
      </div>
      <div class="category-menu" @click="selectedCategory('env')">환경설정</div>

      <div
        class="category-menu"
        v-if="$store.state.isAdmin"
        @click="selectedCategory('admin')"
      >
        관리자 페이지
      </div>
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
      currentCategory: "main",
      openCategories: [],
    };
  },
  methods: {
    selectedCategory(category) {
      this.currentCategory = category;
      this.$router.push(`/${category}`);
    },
    toggleCategory(category) {
      if (this.isCategoryOpen(category)) {
        this.openCategories = this.openCategories.filter((c) => c !== category);
      } else {
        this.openCategories.push(category);
      }
    },
    isCategoryOpen(category) {
      return this.openCategories.includes(category);
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
  background: linear-gradient(to top, #00b869, #03c75a);
}
.category-sub-menu {
  font-size: 80px;
  padding: 50px;
  background: linear-gradient(to top, #00b869, #03c75a);
  opacity: 0;
  max-height: 0; /* 초기값을 작게 설정 */
  overflow: hidden;
}

.category-menu.open + .category-sub-menu {
  opacity: 1;
  max-height: 200px; /* 나타날 때의 최대 높이 설정 */
}

.category-sub-menu-item {
  cursor: pointer;
}
</style>
