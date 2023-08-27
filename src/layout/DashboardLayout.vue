<template>
  <div class="wrapper">
    <side-bar>
      <sidebar-link v-if="shouldShowUserInfoLink" to="/user">
        <i class="nc-icon nc-circle-09"></i>
        <p>회원정보</p>
      </sidebar-link>
      <sidebar-link to="/list">
        <i class="nc-icon nc-grid-45"></i>
        <p>게시판</p>
      </sidebar-link>
      <sidebar-link to="/backtrack">
        <i class="nc-icon nc-note-03"></i>
        <p>백킹트랙</p>
      </sidebar-link>
      <sidebar-link to="/table-list">
        <i class="nc-icon nc-settings-gear-64"></i>
        <p>환경설정</p>
      </sidebar-link>
      <sidebar-link to="/typography">
        <i class="nc-icon nc-chat-round"></i>
        <p>문의사항</p>
      </sidebar-link>
    </side-bar>
    <header-section></header-section>
    <div class="main-panel">
      <dashboard-content> </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, readonly, provide, inject } from "vue";
import HeaderSection from "./HeaderSection.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu.vue";
import sideBar from "../components/SidebarPlugin/SideBar.vue";
import sidebarLink from "../components/SidebarPlugin/SidebarLink.vue";
export default defineComponent({
  components: {
    HeaderSection,
    ContentFooter,
    DashboardContent,
    MobileMenu,
    sideBar,
    sidebarLink,
  },
  methods: {},
  computed: {
    shouldShowUserInfoLink() {
      return this.$store.state.isAuthenticated;
    },
  },
});
</script>
