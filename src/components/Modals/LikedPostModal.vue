<template>
  <v-dialog v-model="$store.state.showLikedPostModal" persistent="">
    <div class="liked-post-modal">
      <h2
        class="mb-3"
        style="font-size: 6em; margin-top: 100px; font-weight: 400"
      >
        {{ $store.state.loggedInNickname }} 님의 좋아요 목록
      </h2>

      <div style="font-size: 3em; margin-top: 100px">
        하트를 누른 다른 사람의 게시글이 이 곳에 저장됩니다. <br />언제든지
        불러와서 재생할 수 있습니다.
      </div>
      <v-card class="mx-auto" max-width="1000">
        <v-list>
          <v-list-item
            v-for="likedPost in likedPostData"
            :key="Object.keys(likedPost)[0]"
            @click="getLikedPost(Object.keys(likedPost)[0])"
          >
            <v-list-item-title v-for="(value, key) in likedPost" :key="key">
              {{ value }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
      <button
        type="button"
        @click="closeAllModals"
        class="btn-success"
        style="font-size: 3.5em"
      >
        확인
      </button>
    </div>
    <v-pagination
      v-model="currentPage"
      :length="pageCount"
      @update:model-value="onPageChange"
      size="x-large"
      class="page"
      style="margin-top: 1120px"
    >
    </v-pagination>
  </v-dialog>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      likedPostData: [],
      currentPage: 1,
      totalItems: 0,
      itemsPerPage: 10,
    };
  },
  methods: {
    closeAllModals() {
      this.$store.commit("toggleShowLikedPostModal", false);
    },
    async getLikedPost(postId) {
      try {
        const response = await this.$axios.get(`/api/post/${postId}`);
        const likedPost = response.data;
      } catch (error) {
        console.error("Error fetching liked post:", error);
      }
    },
    async fetchLikedPostData() {
      try {
        const response = await this.$axios.get(
          `/api/mypage/userInfo/likes?page=${this.currentPage}`,
          {
            withCredentials: true,
          }
        );
        this.likedPostData = response.data.filteredLikedPostTitles;
        this.totalItems = response.data.totalItems;
      } catch (error) {
        console.error("Error fetching liked post data:", error);
      }
    },
    onPageChange(page) {
      this.currentPage = page;
      this.fetchLikedPostData();
    },
  },

  computed: {
    likedPosts() {
      return this.$store.state.likedPosts || [];
    },
    pageCount() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
  },
  created() {
    this.fetchLikedPostData();
  },
};
</script>

<style scoped>
.liked-post-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid lightgray;
  padding: 4rem 4rem;
  border-radius: 5px;
  background: #fefefe;
  max-width: 1500px;
  width: 100%;
  height: 2000px;
  text-align: center;
}

.liked-post-modal h2 {
  font-size: 6em;
  margin-top: 400px;
  margin-bottom: 1rem;
}

.btn-success {
  position: fixed;
  bottom: 100px;
  right: 0;
  padding: 1em 2.5em;
  font-size: 3.5em;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 700;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  transform: translateX(-50%);
}

.btn-success:hover {
  background-color: #155724;
  box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
  color: #fff;
  transform: translate(-50%, -7px);
}

.btn-success:active {
  transform: translate(-50%, -1px);
}

:deep(.v-list-item-title) {
  font-size: 3rem;
  line-height: 5rem;
}

:deep(.v-pagination .v-btn) {
  font-size: 50px;
  width: 100px;
  height: 100px;
}
</style>
