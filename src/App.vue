<template>
  <v-app>
    <v-main>
      <Backtrack />
    </v-main>
  </v-app>
</template>

<script>
import Backtrack from "./components/BacktrackGenerator.vue";
import { defineComponent } from "vue";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
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
