<template>
  <v-sheet class="position-absolute" min-height="450">
    <div
      class="position-absolute d-flex align-center justify-center w-100 h-100"
    >
      <svg
        v-if="!dialog"
        @click="openDialog"
        width="80"
        height="80"
        viewBox="0 0 68 68"
        fill="#CCCCCC"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_26_10)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M48.0833 19.799C48.619 20.3347 48.806 21.127 48.5665 21.8457L35.8385 60.0294C35.5946 60.7614 34.9513 61.2877 34.1855 61.382C33.4198 61.4763 32.6681 61.1217 32.2539 60.4707L22.593 45.2893L7.41158 35.6285C6.76065 35.2142 6.40604 34.4625 6.50031 33.6968C6.59458 32.931 7.12092 32.2878 7.85287 32.0438L46.0366 19.3159C46.7553 19.0763 47.5476 19.2633 48.0833 19.799ZM26.5903 44.1204L33.3726 54.7782L42.0926 28.6181L26.5903 44.1204ZM39.2642 25.7897L23.7619 41.292L13.1041 34.5097L39.2642 25.7897Z"
            fill=""
          />
        </g>
        <defs>
          <clipPath id="clip0_26_10">
            <rect
              width="48"
              height="48"
              fill="white"
              transform="translate(33.9412) rotate(45)"
            />
          </clipPath>
        </defs>
      </svg>
    </div>

    <v-fade-transition hide-on-leave>
      <chat
        v-if="isUserLoggedIn && dialog"
        append-icon="$close"
        elevation="16"
        max-width="500"
        title="Send a receipt"
      >
        <template v-slot:append>
          <v-btn icon="$close" variant="text" @click="dialog = false"></v-btn>
        </template>
      </chat>
    </v-fade-transition>
  </v-sheet>
</template>
<script>
import Chat from "../pages/Chat.vue";
import * as Toast from "../plugins/toast";
export default {
  data() {
    return {
      dialog: false,
    };
  },
  components: {
    Chat,
  },
  computed: {
    isUserLoggedIn() {
      return this.$store.state.isAuthenticated;
    },
  },
  methods: {
    openDialog() {
      if (this.isUserLoggedIn) {
        this.dialog = true;
      } else {
        Toast.customError("로그인이 필요합니다.");
      }
    },
  },
};
</script>
<style scoped>
svg {
  cursor: pointer;
  /* z-index: -1; */
  position: fixed;

  top: auto;
  left: auto;
  bottom: 0;
  right: 0;
  width: 7%;
  height: auto;
  transition: 0.3s;
}

svg:hover {
  fill: #999999;
}
</style>
