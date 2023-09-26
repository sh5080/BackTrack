<template>
  <v-card class="mx-auto" width="">
    <v-container fluid>
      <v-row align="center">
        <v-col cols="6">
          <h4
            class="title"
            style="
              font-size: 90px;
              margin-bottom: 80px;
              font-weight: 500;
              padding: 50px 100px;
            "
          >
            게시판 (백킹트랙 공유)
          </h4>
        </v-col>
      </v-row>

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
            <img
              v-if="post.image"
              :src="post.image"
              onerror="this.src='/img/no_image.png'"
              cover
              class="card-img"
            />

            <img v-else cover class="card-img" :src="noImageSrc" />

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
                  @click.stop="toggleLike(post.id)"
                  class="card-btn"
                >
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>

          <div class="text-center pt-2"></div>
        </v-col>
        <v-col
          v-for="dummy in (8 - (posts.length % 8)) % 8"
          :key="dummy"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          style="padding: 100px"
        >
          <div style="height: 1106px; width: 100%"></div>
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
    <!-- <v-col cols="6" class="">
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            style="font-size: 70px; height: 150px; margin-right: 200px"
          >
            {{ selectedSortText }}
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in sortOptions"
            style="height: 150px"
            :key="index"
            @click="sortedPosts(item.value)"
          >
            <v-list-item-title style="font-size: 70px; line-height: 5.5rem">{{
              item.text
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col> -->
    <div class="page-container">
      <v-col cols="1">
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              style="
                font-size: 70px;
                height: 150px;

                width: 350px;
              "
            >
              {{ selectedSortSearch }}
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in searchOptions"
              style="height: 150px"
              :key="index"
              @click="sortedSearch(item.value)"
            >
              <v-list-item-title style="font-size: 70px; line-height: 5.5rem">{{
                item.text
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu></v-col
      >
      <v-col cols="3">
        <v-card
          class="mx-auto text-right"
          color="grey-lighten-3"
          max-width="1200"
        >
          <v-card-text>
            <v-text-field
              v-model="searchValue"
              @keyup.enter="fetchPosts(searchValue, selectedSearch)"
              density="compact"
              variant="solo"
              append-inner-icon="mdi-magnify"
              single-line
              hide-details
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" class="d-flex">
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              style="
                font-size: 70px;
                height: 150px;

                width: 400px;
              "
            >
              {{ selectedSortPost }}
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in sortOptions"
              style="height: 150px"
              :key="index"
              @click="sortedPosts(item.value)"
            >
              <v-list-item-title style="font-size: 70px; line-height: 5.5rem">{{
                item.text
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </div>
  </v-card>
  <v-dialog v-model="$store.state.showPostModal">
    <PostModal />
  </v-dialog>
</template>
<script>
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
      noImageSrc: "/img/no_image.png",
      sortOptions: [
        { text: "최신순", value: "latest" },
        { text: "오래된순", value: "oldest" },
        { text: "좋아요 순", value: "likes" },
      ],
      selectedSort: "latest",
      searchOptions: [
        { text: "제목", value: "title" },
        { text: "작성자", value: "author" },
        { text: "내용", value: "description" },
      ],
      selectedSearch: "title",
      searchValue: "",
    };
  },
  components: {
    PostModal,
  },
  computed: {
    selectedSortPost() {
      const selectedOption = this.sortOptions.find(
        (option) => option.value === this.selectedSort
      );
      return selectedOption ? selectedOption.text : "";
    },
    selectedSortSearch() {
      const selectedOption = this.searchOptions.find(
        (option) => option.value === this.selectedSearch
      );
      return selectedOption ? selectedOption.text : "";
    },
    pageCount() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
  },
  created() {
    this.fetchPosts();
  },
  methods: {
    sortedPosts(value) {
      this.selectedSort = value;
      this.fetchPosts();
    },
    sortedSearch(value) {
      this.selectedSearch = value;
      this.fetchPosts(value);
    },
    onPageChange(newPage) {
      this.currentPage = newPage;
      this.fetchPosts(this.searchValue, this.selectedSearch);
    },
    isLiked(postId) {
      const likedPosts = this.$store.state.likedPosts || [];
      return likedPosts.includes(postId);
    },
    //게시판에서 post 불러오는 모달
    async openPost(postId, backtrackId, author) {
      try {
        const response = await this.$axios.get(
          `/api/post/${postId}`,

          {
            withCredentials: true,
          }
        );

        const backtrackResponse = await this.$axios.get(
          `/api/backtrack/detail`,
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
    async fetchPosts(value, option) {
      try {
        let apiUrl = `/api/post?page=${this.currentPage}`;

        if (this.selectedSort === "oldest") {
          apiUrl += "&sortBy=oldest";
        } else if (this.selectedSort === "likes") {
          apiUrl += "&sortBy=likes";
        } else {
          apiUrl += "&sortBy=latest";
        }
        if (option) {
          apiUrl += `&option=${option}`;
        }
        if (value) {
          apiUrl += `&searchBy=${value}`;
        }

        const response = await this.$axios.get(apiUrl, {
          withCredentials: true,
        });

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
      const response = await this.$axios.post(
        `/api/post/like/`,
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
      const response = await this.$axios.delete(
        `/api/post/like/${postId}`,

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
:deep(.v-card-text) {
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
:deep(.v-pagination .v-btn) {
  font-size: 50px;
  width: 100px;
  height: 100px;
}
:deep(.v-field--center-affix .v-field__append-inner) {
  font-size: 50px;
}
:deep(.v-text-field .v-field--single-line input) {
  height: 150px;
  font-size: 70px;
}
.page-container {
  display: flex;
  padding: 50px;
}
</style>
