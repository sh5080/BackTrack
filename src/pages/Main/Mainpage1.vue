<template>
  <div class="main-body">
    <h1 class="main-title">원하는 코드로 반주를 생성해보세요</h1>
    <h1 class="main-title start" @click="goBacktrack">시작하기</h1>
  </div>
</template>
<script>
export default {
  methods: {
    goBacktrack() {
      this.$router.push("/backtrack");
    },
  },
};
</script>

<style scoped>
.main-body {
  text-align: center;
  position: relative;
  top: 30%;
  /* top: 10%; */
}

.main-title {
  color: #1d1d22;
  /* font-size: 10rem; */
  line-height: 10rem;
  z-index: 999;
  text-align: center;
  margin: 0;
  /* padding: 80px; */
}

.start:hover {
  transform: scale(1.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}
</style>
