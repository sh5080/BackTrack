<template>
  <div>
    <div v-if="showComponent">
      <!-- 라우터~~! -->
      <router-view>
        <component
          :is="component"
          v-for="component in currentComponents"
          :key="component.name"
        />
      </router-view>
    </div>
    <div v-else>
      <!--  메인 화면 등 -->
    </div>
  </div>
</template>

<script>
import Main from "../pages/Main.vue";
import Backtrack from "../pages/BacktrackGenerator.vue";
import Questions from "../pages/Questions.vue";
import Board from "../pages/Board.vue";
export default {
  computed: {
    showComponent() {
      return !!this.currentComponents;
    },
    currentComponents() {
      const matchedChildren = this.currentRoute.matched[0].children;
      const components = [];

      for (const child of matchedChildren) {
        if (child.name === "Main") {
          components.push(Main);
        } else if (child.name === "Backtrack") {
          components.push(Backtrack);
        } else if (child.name === "Questions") {
          components.push(Questions);
        } else if (child.name === "Board") {
          components.push(Board);
        }
      }
      console.log("1: ", components);

      return components;
    },
  },
  watch: {
    $route(to, from) {
      this.currentRoute = to;
    },
  },
  data() {
    return {
      currentRoute: this.$route,
    };
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
  .fade-leave-to
    /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
