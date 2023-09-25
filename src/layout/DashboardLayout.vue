<template>
  <div class="wrapper">
    <side-bar style="z-index: 10">
      <sidebar-link to="/backtrack">
        <i class="nc-icon nc-note-03"></i>
        <p>백킹트랙</p>
      </sidebar-link>
      <sidebar-link v-if="shouldShowUserInfoLink" to="/user">
        <i class="nc-icon nc-circle-09"></i>
        <p>회원정보</p>
      </sidebar-link>
      <sidebar-link to="/board">
        <i class="nc-icon nc-grid-45"></i>
        <p>게시판</p>
      </sidebar-link>
      <sidebar-link to="/community">
        <i class="nc-icon nc-bullet-list-67"></i>
        <p>커뮤니티</p>
      </sidebar-link>

      <sidebar-link to="/board">
        <i class="nc-icon nc-settings-gear-64"></i>
        <p>환경설정</p>
      </sidebar-link>
      <sidebar-link to="/questions">
        <i class="nc-icon nc-chat-round"></i>
        <p>문의사항</p>
      </sidebar-link>
      <sidebar-link
        v-if="shouldShowAdminLink"
        style="margin-top: 400px"
        to="/admin"
      >
        <i class="nc-icon nc-settings-gear-64"></i>
        <p>관리자</p>
      </sidebar-link>
    </side-bar>
    <div class="content-wrapper">
      <header-section></header-section>

      <div class="main-panel">
        <chat> </chat>
        <dashboard-content> </dashboard-content>
        <content-footer></content-footer>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import HeaderSection from "./HeaderSection.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu.vue";
import sideBar from "../components/SidebarPlugin/SideBar.vue";
import sidebarLink from "../components/SidebarPlugin/SidebarLink.vue";
import Chat from "./Chat.vue";
export default defineComponent({
  components: {
    HeaderSection,
    ContentFooter,
    DashboardContent,
    MobileMenu,
    sideBar,
    sidebarLink,
    Chat,
  },
  methods: {},
  computed: {
    shouldShowUserInfoLink() {
      return this.$store.state.isAuthenticated;
    },
    shouldShowAdminLink() {
      return this.$store.state.isAdmin;
    },
  },
});
</script>
<style></style>
