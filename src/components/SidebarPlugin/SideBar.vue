<template>
  <div
    id="sidebar"
    class="sidebar"
    :style="sidebarStyle"
    :data-color="backgroundColor"
  >
    <div
      class="sidebar-wrapper"
      :data-color="backgroundColor"
      :style="sidebarStyle"
    >
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
          width: sidebarExpanded ? '260px' : '80px',
        }"
      >
        <slot>
          <sidebar-link
            v-for="(link, index) in sidebarLinks"
            :key="link.name + index"
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
  },

  computed: {
    sidebarStyle() {
      return {
        width: this.sidebarExpanded ? "260px" : "80px",
        height: "500px",
        borderRadius: "100px",
        // boxShadow: " 20px 20px 20px rgba(0, 0, 0, 0.1)",
        textShadow: " 4px 4px 4px rgba(0, 0, 0, 0.2)",
      };
    },
  },
  data() {
    return {
      // sidebarExpanded: false,
      sidebarExpanded: this.$store.state.openSidebar,
    };
  },
  methods: {
    toggleSidebar() {
      this.$store.commit("setOpenSidebar", !this.sidebarExpanded);
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
  position: fixed;
  /* top: 15%;
  left: 0 !important; */
  top: 15%;
  left: 1%;
  /* transform: translate(-50%, -50%); */
  /* transform: translateY(-50%); */
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
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
}
.toggle-button {
  position: absolute;
  top: 10%;
  right: 0;
  height: 80%;
  /* width: 55px; */
  z-index: 9999 !important;
  cursor: pointer;
  padding: 8px;
  border-radius: 100px;
  /* box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); */
}
.toggle-button:hover {
  background-color: rgba(14, 81, 111, 0.6);
}
</style>
