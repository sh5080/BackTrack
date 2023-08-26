<template>
  <card v-if="fetchedUserInfo" class="card-user">
    <div class="author">
      <h4 class="title">기본 회원정보</h4>
      <div class="user-info">
        <div class="info-item">
          <span class="info-label">아이디</span>
          <span class="info-value">{{ fetchedUserInfo.username }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">닉네임</span>
          <span class="info-value">{{ fetchedUserInfo.nickname }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">이메일</span>
          <span class="info-value">{{ fetchedUserInfo.email }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">현재 로그인방식</span>
          <span class="info-value">{{ $store.state.provider }}</span>
        </div>
      </div>
    </div>

    <div slot="footer" class="text-center d-flex justify-content-center">
      <button href="#" class="btn btn-simple">
        <i class="fa fa-facebook-square"></i>
      </button>
      <button href="#" class="btn btn-simple">
        <i class="fa fa-twitter"></i>
      </button>
      <button href="#" class="btn btn-simple">
        <i class="fa fa-google-plus-square"></i>
      </button>
    </div>
  </card>
</template>
<script>
import Card from "src/components/Cards/Card.vue";
import axios from "axios";
export default {
  props: ["userInfo"],
  components: {
    Card,
  },
  data() {
    return {
      username: this.$store.state.loggedInUsername,
      fetchedUserInfo: null,
    };
  },
  created() {
    this.fetchUserInfo();
  },
  methods: {
    getClasses(index) {
      var remainder = index % 3;
      if (remainder === 0) {
        return "col-md-3 col-md-offset-1";
      } else if (remainder === 2) {
        return "col-md-4";
      } else {
        return "col-md-3";
      }
    },
    async fetchUserInfo() {
      try {
        await this.$store.dispatch("fetchTokenData");
        const response = await axios.get(
          `http://localhost:4000/api/mypage/userInfo?username=${this.$store.state.loggedInUsername}`,
          {
            withCredentials: true,
          }
        );

        this.fetchedUserInfo = response.data;
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },
  },
};
</script>
<style scoped>
.author {
  margin-top: 20px;
  padding: 50px 100px;
}

.title {
  font-size: 90px;
  margin-bottom: 80px;
  font-weight: 500;
}

.user-info {
  border-top: 1px solid #ccc;
  margin-top: 30px;
}

.info-item {
  margin-top: 50px;
  margin-bottom: 10px;
}

.info-label {
  display: inline-block;
  width: 600px;
  font-size: 80px;
  font-weight: 400;
}

.info-value {
  display: inline-block;
  font-size: 80px;
  margin-left: 10px;
}
</style>
