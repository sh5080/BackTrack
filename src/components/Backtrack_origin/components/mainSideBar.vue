<!-- <template>
  <div class="side-bar-wrapper">
    <VueResizable
      class="resizable-side-bar"
      :width="1000"
      :min-width="500"
      :max-width="Infinity"
      :active="['r']"
      v-if="isVisibleSideBar"
    >
      <div class="side-bar">
        <div class="categories">
          <router-link
            v-for="category in categories"
            :key="category.id"
            :to="`/category/${category.name}`"
            class="category-item"
          >
            {{ category.name }}
          </router-link>
        </div>
      </div>
    </VueResizable>
    <button class="side-bar-active-btn" size="sm" @click="showSideBar">
      {{ isVisibleSideBar ? "닫힘" : "메뉴" }}
    </button>
  </div>
</template>

<script>
import VueResizable from "vue-resizable";
export default {
  name: "SideBar",
  components: {
    VueResizable,
  },
  data() {
    return {
      isVisibleSideBar: false,
      currentCategory: "main",
      categories: [
        {
          id: 1,
          name: "backtrack",
          image: "../assets/category_icon1.png",
        },
        { id: 2, name: "카테고리1" },
        { id: 3, name: "카테고리2" },
      ],
    };
  },
  methods: {
    showSideBar() {
      this.isVisibleSideBar = !this.isVisibleSideBar;
    },
  },
};
</script>

<style lang="scss" scoped>
.side-bar-wrapper {
  position: fixed;
  display: flex;
  color: #fff;
  font-size: 80px;
  margin-top: 100px;
  z-index: 1;
  > .resizable-side-bar {
    > .side-bar {
      background-color: rgba(23, 23, 23, 0.5);
      position: relative;
      width: 1000px;
      z-index: 1;
    }
    .categories {
      display: flex;
      flex-direction: column;
    }
    .category-item {
      margin-bottom: 0px;
      padding: 50px;
      color: rgb(255, 255, 255);
      //   background-color: #000000;
      text-decoration: none;
      transition: opacity 0.3s;
    }

    .category-item:hover {
      opacity: 0.8;
    }
  }

  > .side-bar-active-btn {
    position: relative;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000000;
    padding: 0;
    border: none;
    border-radius: unset;
    color: #fff;
    opacity: 0.5;
    width: 200px;
    height: 200px;
    font-size: 50px;
    // align-self: flex-end;
    // margin-top: auto;
  }
}
</style> -->
