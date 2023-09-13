<template>
  <div>
    <div v-if="showComponent">
      <!-- 라우터~~! -->
      <router-view>
        <div ref="componentRef">
          <component
            :id="getComponentName(component)"
            :is="component"
            v-for="component in currentComponents"
            :key="component"
          />
        </div>
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
        } else if (child.name === "Board") {
          components.push(Board);
        } else if (child.name === "Questions") {
          components.push(Questions);
        }
      }

      return components;
    },
  },
  watch: {
    $route(to, from) {
      this.currentRoute = to;
      this.scrollToComponent();
    },
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    getComponentName(component) {
      let filePath = component.__file;
      if (filePath === "src/pages/BacktrackGenerator.vue") {
        filePath = "src/pages/Backtrack.vue";
      }

      if (filePath && filePath.includes("/")) {
        const componentName = filePath.split("/").pop().split(".")[0];
        return componentName;
      } else return component;
    },
    scrollToComponent() {
      const componentName = this.$route.name;
      console.log("name: ", componentName);

      if (componentName) {
        const componentId = this.getComponentName(componentName);
        const componentData = document.querySelector(`#${componentId}`);

        console.log("data: ", componentData);

        if (componentData) {
          componentData.scrollIntoView({ behavior: "smooth" });
        }
      }
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

.content,
.component-style {
  height: 2500px;
  max-height: 2500px;
  /* overflow-y: auto; */
  margin-top: 300px;
  border: 10px solid #000;
}
</style>
