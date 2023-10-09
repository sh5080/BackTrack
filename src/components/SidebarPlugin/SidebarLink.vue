<template>
  <component :is="tag" v-bind="$attrs" tag="li">
    <a class="nav-link" v-bind="$attrs">
      <slot>
        <i v-if="link.icon" :class="link.icon"></i>
        <p>{{ link.name }}</p>
      </slot>
    </a>
  </component>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    link: {
      type: [String, Object],
      default: () => {
        return {
          name: "",
          // path: "",
          icon: "",
        };
      },
    },
    tag: {
      type: String,
      default: "router-link",
    },
  },
};
</script>

<style lang="scss">
@import "../../assets/sass/lbd/sidebar-and-main-panel";
</style>
