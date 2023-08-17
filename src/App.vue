<template>
  <v-app>
    <v-main>
      <header>
        <HeaderSection />
      </header>
      <!-- <Backtrack /> -->
      <router-view></router-view>
    </v-main>
    <footer class="footer">
      <p>문의 prpn97@gmail.com</p>
    </footer>
  </v-app>
</template>

<script>
// import Backtrack from "./components/BacktrackGenerator.vue";
import HeaderSection from "./components/HeaderSection.vue";
import { defineComponent } from "vue";
import { createToast } from "@/libs/mosha-vue-toastify";
import "../src/plugins/style.css";

export default defineComponent({
  name: "App",

  components: {
    HeaderSection,
  },
  setup() {
    const toast = () => {
      createToast("Wow, easy");
    };
    return { toast };
  },
});
</script>

<style>
.footer {
  padding: 20px;
  background-color: #f0f0f0;
  text-align: center;
  font-size: 40px;
}
</style>
