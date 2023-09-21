<template>
  <v-card class="mx-auto" width="">
    <v-container fluid>
      <h4
        class="title"
        style="
          font-size: 90px;
          margin-bottom: 80px;
          font-weight: 500;
          padding: 50px 100px;
        "
      >
        게시판
      </h4>
      <v-row dense>
        <v-col
          v-for="post in posts"
          :key="post.id"
          :items-per-page="itemsPerPage"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          style="padding: 100px"
          class="d-flex justify-center"
          @click="openPost(post.id, post.backtrackId, post.author)"
        >
          <v-card style="width: 1000px" class="card-hover">
            <v-img
              :src="post.image"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              cover
              class="card-img"
            >
            </v-img>

            <v-card-subtitle class="pt-4" style="height: 50px">
            </v-card-subtitle>
            <v-card-text>
              <div v-text="post.title"></div>
            </v-card-text>

            <v-card-subtitle
              class="pt-4"
              style="font-size: 2.4rem; line-height: 4rem"
            >
              {{ post.author }}
            </v-card-subtitle>
            <v-card-actions>
              <v-spacer></v-spacer>
              <div
                class="likes-count"
                ref="likesCount"
                v-bind:id="'likes-count-' + post.id"
              >
                {{ post.likedUsers ? post.likedUsers.length : "" }}
              </div>
              <div>
                <v-btn
                  size="x-large"
                  :color="isLiked(post.id) ? 'pink' : 'surface-variant'"
                  variant="text"
                  icon="mdi-heart"
                  @click.stop="toggleLike(post.id, post.author)"
                  class="card-btn"
                >
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>

          <div class="text-center pt-2"></div>
        </v-col>
      </v-row>
    </v-container>
    <div class="text-center pt-2">
      <v-pagination
        v-model="currentPage"
        :length="pageCount"
        @update:model-value="onPageChange"
        size="x-large"
        class="page"
      ></v-pagination>
    </div>
  </v-card>
  <v-dialog v-model="$store.state.showPostModal">
    <PostModal />
  </v-dialog>
</template>
<script>
import axios from "axios";
import * as Toast from "../../plugins/toast";
import PostModal from "../../components/Modals/PostModal.vue";
export default {
  data() {
    return {
      posts: [],
      currentPage: 1,
      itemsPerPage: 8,
      totalItems: null,
      totalLikedCount: null,
    };
  },
  components: {
    PostModal,
  },
  computed: {
    pageCount() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
  },
  created() {
    this.fetchPosts();
  },
  methods: {
    onPageChange(newPage) {
      this.currentPage = newPage;
      this.fetchPosts();
    },
    isLiked(postId) {
      const likedPosts = this.$store.state.likedPosts || [];
      return likedPosts.includes(postId);
    },
    //게시판에서 post 불러오는 모달
    async openPost(postId, backtrackId, author) {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/post/${postId}`,

          {
            withCredentials: true,
          }
        );

        const backtrackResponse = await axios.get(
          `http://localhost:4000/api/backtrack/detail`,
          {
            params: {
              id: backtrackId,
            },
            withCredentials: true,
          }
        );
        const backtrackData = backtrackResponse.data.backtrackData;
        if (backtrackData) {
          this.$store.commit("setChordData", backtrackData.backtrack);
          this.$store.commit("setBacktrackData", backtrackData);
        }

        const result = response.data.postData;

        this.$store.commit("setPostData", result);
        this.$store.commit("setPostAuthor", author);
        this.$store.commit("toggleShowPostModal", true);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },
    //게시판 post
    async fetchPosts() {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/post?page=${this.currentPage}`,

          {
            withCredentials: true,
          }
        );

        this.posts = response.data.postData.paginatedPosts;
        this.totalItems = response.data.postData.totalItemsCount;
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },
    async toggleLike(postId) {
      if (!this.$store.state.isAuthenticated) {
        Toast.customError("로그인 이후 가능한 서비스입니다.");
        return;
      }
      const liked = this.isLiked(postId);
      if (liked) {
        await this.removeLike(postId);
      } else {
        await this.addLike(postId);
      }
      this.$store.commit("updateLikedPosts", postId);
    },
    async addLike(postId) {
      const response = await axios.post(
        `http://localhost:4000/api/post/like/`,
        { postId: postId },
        {
          withCredentials: true,
        }
      );
      const likesCountElement = document.querySelector(
        `#likes-count-${postId}`
      );
      if (response.data.likesCount !== null) {
        if (likesCountElement) {
          const currentLikesCount = parseInt(
            likesCountElement.textContent.trim()
          );
          likesCountElement.textContent = isNaN(currentLikesCount)
            ? 1
            : currentLikesCount + 1;
        } else {
          console.error(`Likes count element for post ${postId} not found`);
        }
      }
    },
    async removeLike(postId) {
      const response = await axios.delete(
        `http://localhost:4000/api/post/like/${postId}`,

        {
          withCredentials: true,
        }
      );
      const likesCountElement = document.querySelector(
        `#likes-count-${postId}`
      );
      if (response.data.likesCount !== null) {
        if (likesCountElement) {
          const currentLikesCount = parseInt(
            likesCountElement.textContent.trim()
          );
          likesCountElement.textContent = isNaN(currentLikesCount)
            ? ""
            : currentLikesCount - 1;
        } else {
          console.error(`Likes count element for post ${postId} not found`);
        }
      }
    },
  },
};
</script>

<style scoped>
::v-deep .v-card-text {
  font-size: 3.5rem;
}

.card-btn {
  width: 100px;
  height: 100px;
  font-size: 40px;
  padding: 10px 60px;
}
.card-img {
  height: 800px;
}
.likes-count {
  font-size: 50px;
}

.card-hover:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
  cursor: pointer;
}
::v-deep .v-pagination .v-btn {
  font-size: 50px;
  width: 100px;
  height: 100px;
}
</style>
