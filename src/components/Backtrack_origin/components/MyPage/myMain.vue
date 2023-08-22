<template>
  <div class="my-main">
    <h2 style="margin-bottom: 90px">회원정보</h2>
    <table v-if="fetchedUserInfo" class="user-info-table">
      <tr>
        <th>아이디</th>
        <td>{{ fetchedUserInfo.username }}</td>
      </tr>
      <tr>
        <th>이메일</th>
        <td>{{ fetchedUserInfo.email }}</td>
      </tr>
      <tr>
        <th>현재 로그인방식</th>
        <td>{{ $store.state.provider }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["userInfo"],

  data() {
    return {
      username: this.$store.state.loggedInUsername,
      fetchedUserInfo: null,
    };
  },
  created() {
    this.fetchUserInfo();
  },
  // watch: {
  //   "$store.state.isAuthenticated"(newValue) {
  //     if (!newValue) {
  //       // 인증되지 않은 경우 로그아웃 처리
  //       console.log(newValue);
  //       this.$router.push("/login"); // 로그아웃 후 리다이렉트할 경로
  //     }
  //   },
  // },
  methods: {
    async fetchUserInfo() {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/mypage/userInfo?username=${this.username}`,
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
.my-main {
  margin-top: 100px;
  margin-left: 30px;
}
.user-info-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
  font-size: 70px;
  margin-top: 30px;
}

.user-info-table th,
.user-info-table td {
  padding: 15px 50px;
  text-align: left;
  border: 1px solid #ccc;
  background-color: #ffffff;
}

.user-info-table th {
  background-color: #f0f0f0;
}
</style>
