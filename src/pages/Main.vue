<template>
  <div>
    <!-- cycle -->
    <v-carousel
      height="2200"
      hide-delimiter-background
      show-arrows="hover"
      color="success"
      size="1000"
      @mouseenter="showDelimiters = true"
      @mouseleave="showDelimiters = false"
    >
      <v-carousel-item>
        <Mainpage1 />
      </v-carousel-item>
      <v-carousel-item>
        <Mainpage2 />
      </v-carousel-item>
      <v-carousel-item>
        <Mainpage3 />
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
import Mainpage1 from "./Main/Mainpage1.vue";
import Mainpage2 from "./Main/Mainpage2.vue";
import Mainpage3 from "./Main/Mainpage3.vue";
export default {
  components: {
    Mainpage1,
    Mainpage2,
    Mainpage3,
  },
  data() {
    return {
      showDelimiters: false,
    };
  },
};
</script>
<style scoped>
:deep(button:not(:disabled), [type="button"]:not(:disabled)) {
  cursor: pointer;
  font-size: 5rem;
  width: 200px;
  height: 200px;
}
:deep(.v-carousel--hide-delimiter-background .v-carousel__controls) {
  padding: 100px;
}
</style>
