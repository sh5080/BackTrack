<template>
  <div
    id="sidebar"
    class="sidebar"
    :style="sidebarStyle"
    :data-color="backgroundColor"
  >
    <div class="sidebar-wrapper" :data-color="backgroundColor">
      <div class="logo" @click="goMain" v-show="sidebarExpanded">
        <a class="simple-text logo__container">
          <div class="logo-img"></div>
          {{ title }}
        </a>
      </div>

      <slot name="content"></slot>
      <ul
        class="nav nav-main__links"
        :style="{
          width: sidebarExpanded ? '1000px' : '280px',
        }"
      >
        <slot>
          <sidebar-link
            v-for="(link, index) in sidebarLinks"
            :key="link.name + index"
            :to="link.path"
            :link="link"
            :sidebarExpanded="sidebarExpanded"
          >
            <i :class="link.icon"></i>
          </sidebar-link>
        </slot>
      </ul>
    </div>
    <div class="toggle-button" @click="toggleSidebar"></div>
  </div>
</template>
<script>
import SidebarLink from "./SidebarLink.vue";

export default {
  components: {
    SidebarLink,
  },

  props: {
    title: {
      type: String,
      default: "TwoFiveOne",
    },
    backgroundColor: {
      type: String,
      default: "azure",
      validator: (value) => {
        let acceptedValues = [
          "",
          "blue",
          "azure",
          "green",
          "orange",
          "red",
          "purple",
          "black",
        ];
        return acceptedValues.indexOf(value) !== -1;
      },
    },

    sidebarLinks: {
      type: Array,
      default: () => [],
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
  },
  provide() {
    return {
      autoClose: this.autoClose,
    };
  },
  computed: {
    sidebarStyle() {
      return {
        width: this.sidebarExpanded ? "1000px" : "280px",
        borderRadius: "100px",
        boxShadow: " 20px 20px 20px rgba(0, 0, 0, 0.1)",
        textShadow: " 4px 4px 4px rgba(0, 0, 0, 0.5)",
      };
    },
  },
  data() {
    return {
      sidebarExpanded: false,
      sidebarLinks: [
        { name: "Main", path: "/main", scrollPosition: 0 },
        { name: "Backtrack", path: "/backtrack", scrollPosition: 200 },
        { name: "User", path: "/user", scrollPosition: 400 }, // 싱글 페이지 렌더링
      ],
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarExpanded = !this.sidebarExpanded;
    },
    goMain() {
      this.$router.push("/");
    },
  },
};
</script>
<style>
.logo {
  cursor: pointer;
}
#sidebar {
  height: 2000px;

  top: 400px;
  left: 30px;
}

.sidebar .sidebar-wrapper {
  display: flex;
  flex-direction: column;
}

.sidebar .nav-main__links {
  flex: 1;
}
.sidebar .sidebar-wrapper .logo .logo__container {
  padding-left: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
.toggle-button {
  position: absolute;
  top: 0%;
  right: 0;
  height: 100%;
  width: 55px;
  z-index: 9999 !important;
  cursor: pointer;
  padding: 8px;
  border-radius: 100px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
.toggle-button:hover {
  background-color: rgba(14, 81, 111, 0.6);
}

.icon-large {
  font-size: 60px;
}
</style>
