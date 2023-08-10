<template>
  <v-app>
    <v-main>
      <Backtrack />
    </v-main>
    <footer class="footer">
      <p>문의 prpn97@gmail.com</p>
    </footer>
  </v-app>
</template>

<script>
import Backtrack from "./components/BacktrackGenerator.vue";
import { defineComponent } from "vue";
import { createToast } from "mosha-vue-toastify";
import "../src/plugins/style.css";
export default defineComponent({
  name: "App",

  components: {
    Backtrack,
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
