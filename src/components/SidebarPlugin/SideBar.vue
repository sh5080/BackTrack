<template>
  <div class="sidebar" :style="sidebarStyle" :data-color="backgroundColor">
    <div
      class="sidebar-wrapper"
      :style="sidebarStyle"
      :data-color="backgroundColor"
    >
      <div class="logo" @click="goMain" v-show="sidebarExpanded">
        <a class="simple-text logo__container">
          <div class="logo-img">
            <img src="img/vue-logo.png" alt="" />
          </div>
          {{ title }}
        </a>
      </div>

      <slot name="content"></slot>
      <ul
        class="nav nav-main__links"
        :style="{ width: sidebarExpanded ? '1000px' : '280px' }"
      >
        <slot>
          <sidebar-link
            v-for="(link, index) in sidebarLinks"
            :key="link.name + index"
            :to="link.path"
            @click="closeNavbar"
            :link="link"
            :sidebarExpanded="sidebarExpanded"
          >
            <i :class="link.icon"></i>
          </sidebar-link>
        </slot>
      </ul>
    </div>
    <div class="toggle-button" @click="toggleSidebar">
      <i
        :class="
          sidebarExpanded
            ? 'fa fa-chevron-left icon-large'
            : 'fa fa-chevron-right icon-large'
        "
      ></i>
    </div>
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
      default: "BackTracker",
    },
    backgroundColor: {
      type: String,
      default: "black",
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
    backgroundImage: {
      type: String,
      default: "img/sidebar-5.jpg",
    },
    activeColor: {
      type: String,
      default: "success",
      validator: (value) => {
        let acceptedValues = [
          "primary",
          "info",
          "success",
          "warning",
          "danger",
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
        // backgroundImage: `url(${this.backgroundImage})`,
        width: this.sidebarExpanded ? "1000px" : "280px",
      };
    },
  },
  data() {
    return {
      sidebarExpanded: false,
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
.sidebar .sidebar-wrapper {
  display: flex;
  flex-direction: column;
  z-index: 9998 !important;
}
.sidebar .nav-main__links {
  flex: 1;
}
.sidebar .sidebar-wrapper .logo .logo__container {
  padding-left: 10px;
}
.toggle-button {
  position: absolute;
  top: 0%; /* 세로 가운데 정렬을 위한 값 조정 */
  right: 0; /* 사이드바 오른쪽에 위치하도록 설정 */
  height: 10000px;
  width: 95px;
  z-index: 9999 !important;
  cursor: pointer;
  /* background-color: #3f3c3c; */
  padding: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
.toggle-button:hover {
  /* background-color: #3f3c3c; */
  background-color: rgba(63, 60, 60, 0.6);
}

.icon-large {
  font-size: 60px;
}
</style>
