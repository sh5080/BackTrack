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
import Community from "../pages/Community.vue";
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
        } else if (child.name === "Community") {
          components.push(Community);
        } else if (child.name === "Questions") {
          components.push(Questions);
        } else if (child.name === "User" && this.$store.state.isAuthenticated) {
          components.push(User);
        } else if (child.name === "Admin" && this.$store.state.isAdmin) {
          components.push(Admin);
        }
      }
      console.log(components);
      return components;
    },
  },

  methods: {
    getComponentName(component) {
      //개발환경
      let filePath = component.__file;

      if (filePath === "src/pages/BacktrackGenerator.vue") {
        filePath = "src/pages/Backtrack.vue";
      }

      if (filePath === "src/pages/UserProfile.vue") {
        filePath = "src/pages/User.vue";
      }

      if (filePath && filePath.includes("/")) {
        const componentName = filePath.split("/").pop().split(".")[0];
        console.log("여기: ", componentName);
        return componentName;
      }
      //배포환경
      else {
        let componentName = Object.keys(component.components);
        let matchedComponentName = "";

        if (componentName.includes("Mainpage1")) {
          matchedComponentName = "Main";
        } else if (componentName.includes("BacktrackSuccessModal")) {
          matchedComponentName = "Backtrack";
        } else if (componentName.includes("ItemCard")) {
          matchedComponentName = "Board";
        } else if (
          componentName.includes("Card") &&
          componentName.includes("CommunityModal")
        ) {
          matchedComponentName = "Community";
        } else if (
          componentName.includes("Card") &&
          !componentName.includes("CommunityModal")
        ) {
          matchedComponentName = "Questions";
        }
        console.log(matchedComponentName);
        return matchedComponentName;
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
  height: 3200px;
  max-height: 5500px;
  width: 5500px;
  /* margin-left: 200px; */
  /* overflow-y: auto; */
  /* overflow-x: hidden; */
  margin-top: 300px;
  /* border: 10px solid #000; */
  /* padding: 100px 300px; */
}
#Main {
  height: 2400px;
  max-height: 5500px;
  width: 5500px;

  margin-top: 300px;
  border: 10px solid #000;
}
</style>
