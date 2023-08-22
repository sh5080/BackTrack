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
        <span
          class="arrow-icon"
          :class="{ rotated: isCategoryOpen('main') }"
        ></span>
      </div>

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
      this.currentCategory = category;
      this.$router.push(`/${category}`);
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
  margin-top: 200px;
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
  position: relative;
  cursor: pointer;
  background: linear-gradient(to top, #00b869, #03c75a);
}
.arrow-icon {
  position: absolute;
  top: 50%;
  right: 25px;
  width: 30px;
  height: 30px;
  transform: translateY(-50%);
  transition: transform 0.1s ease;
}

.arrow-icon::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(90deg);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 25px solid rgb(8, 92, 3);
  transform-origin: center center left;
}

.rotated {
  transform: translateY(-50%) rotate(-90deg);
}
.category-sub-menu {
  font-size: 80px;
  padding: 50px;
  background: linear-gradient(to top, #00b869, #03c75a);
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.category-menu.open + .category-sub-menu {
  opacity: 1;
  max-height: 200px;
}

.category-sub-menu-item {
  cursor: pointer;
}
</style>
