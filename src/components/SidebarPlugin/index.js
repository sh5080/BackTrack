import { reactive, readonly, defineComponent, provide } from "vue";
import Sidebar from "./SideBar.vue";
import SidebarLink from "./SidebarLink.vue";

const sidebarStore = reactive({
  showSidebar: false,
  sidebarLinks: [
    {
      name: "Dashboard",
      icon: "ti-panel",
      path: "/",
    },
    // ...
  ],
  displaySidebar(value) {
    sidebarStore.showSidebar = value;
  },
});

// SidebarPlugin의 install 메서드 정의
const SidebarPlugin = {
  install(app) {
    // Sidebar 컴포넌트와 SidebarLink 컴포넌트 전역 등록
    app.component("Sidebar", Sidebar);
    app.component("SidebarLink", SidebarLink);

    // provide로 sidebarStore를 전역으로 제공
    app.provide("sidebarStore", sidebarStore);
  },
};

// SidebarPlugin을 내보내기
export default SidebarPlugin;
