<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <user-card> </user-card>
      </div>
    </div>
  </div>
</template>
<script>
import UserCard from "./Card/UserCard.vue";

export default {
  components: {
    UserCard,
  },
};
</script>
<style></style>
