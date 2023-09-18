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
          lg="4"
          style="padding: 100px"
        >
          <v-card>
            <v-img
              :src="post.imageSrc"
              class="align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="800px"
              cover
            >
            </v-img>

            <v-card-subtitle class="pt-4">
              {{ post.title }}
            </v-card-subtitle>

            <v-card-text>
              <div v-text="post.description"></div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <div
                class="likes-count"
                ref="likesCount"
                v-bind:id="'likes-count-' + post.id"
              >
                {{ post.likesCount }}
              </div>
              <v-btn
                size="x-large"
                :color="isLiked(post.id) ? 'pink' : 'surface-variant'"
                variant="text"
                icon="mdi-heart"
                @click="toggleLike(post.id)"
              >
              </v-btn>

              <v-btn
                size="x-large"
                color="surface-variant"
                variant="text"
                icon="mdi-bookmark"
              ></v-btn>

              <v-btn
                size="x-large"
                color="surface-variant"
                variant="text"
                icon="mdi-share-variant"
              ></v-btn>
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
</template>
<script>
import axios from "axios";
import * as Toast from "../../plugins/toast";
export default {
  data() {
    return {
      posts: [],
      currentPage: 1,
      itemsPerPage: 6,
      totalItems: null,
      totalLikedCount: null,
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
  },
  created() {
    this.fetchPosts();
    // this.fetchBacktrackInfo();
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
    async fetchPosts() {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/post?page=${this.currentPage}`,

          {
            withCredentials: true,
          }
        );

        this.posts = response.data.postData.paginatedPosts;
        this.totalItems = response.data.postData.totalPage;
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },
    toggleLike(postId) {
      if (!this.$store.state.isAuthenticated) {
        Toast.customError("로그인한 사용자만 좋아요 가능합니다.");
        return;
      }
      const liked = this.isLiked(postId);
      if (liked) {
        this.removeLike(postId);
      } else {
        this.addLike(postId);
      }
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
      if (!response.data.includes(null)) {
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
      if (!response.data.includes(null)) {
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
  font-size: 3rem;
}
</style>
