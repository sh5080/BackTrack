<template>
  <v-app>
    <v-main>
      <Backtrack />
    </v-main>
  </v-app>
</template>

<script>
import Backtrack from "./components/BacktrackGenerator.vue";

export default {
  name: "App",

  components: {
    Backtrack,
  },

  data: () => ({
    //
  }),
};
</script>
