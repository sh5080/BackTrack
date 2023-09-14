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
import User from "../pages/UserProfile.vue";
import Admin from "../pages/Admin.vue";
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
        } else if (child.name === "User" && this.$store.state.isAuthenticated) {
          components.push(User);
        } else if (child.name === "Admin" && this.$store.state.isAdmin) {
          components.push(Admin);
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
      if (filePath === "src/pages/UserProfile.vue") {
        filePath = "src/pages/User.vue";
      }

      if (filePath && filePath.includes("/")) {
        const componentName = filePath.split("/").pop().split(".")[0];
        return componentName;
      } else return component;
    },
    scrollToComponent() {
      const componentName = this.$route.name;

      if (componentName) {
        const componentId = this.getComponentName(componentName);

        const componentData = document.querySelector(`#${componentId}`);

        if (componentData) {
          const yOffset = componentData.getBoundingClientRect().top;
          window.scrollBy({ top: yOffset - 270, behavior: "smooth" });
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
  overflow-y: auto;
  margin-top: 300px;
  border: 10px solid #000;
  /* padding: 100px 300px; */
}
</style>
