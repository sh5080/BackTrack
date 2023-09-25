<template>
  <v-dialog v-model="$store.state.showCommunityModal" persistent="">
    <card class="card-community">
      <template v-slot:header>
        <h4 class="card-title">{{ $store.state.communityData.title }}</h4>
        <span class="card-author"
          >{{ $store.state.communityData.author }} |
          {{
            new Date($store.state.communityData.createdAt)
              .toISOString()
              .split("T")[0]
          }}</span
        >
      </template>

      <div class="card-body">
        <div class="description-sheet">
          <span class="description">{{
            $store.state.communityData.description
          }}</span>
        </div>
      </div>

      <template v-slot:footer>
        <div class="custom-footer">
          <div class="comment-sheet">
            최근 댓글
            <v-card width="2800">
              <div class="description-container">
                <v-dialog
                  v-model="showNewComment"
                  width="auto"
                  style="margin-right: 1850px"
                  transition="dialog-bottom-transition"
                >
                  <!-- </div> -->
                  <!--  -->

                  <!--  -->
                  <v-card class="open-comment">
                    댓글
                    <div
                      v-if="showNewComment"
                      :key="showNewComment"
                      class="new-comment-container"
                    >
                      <div
                        v-for="comment in allComments"
                        :key="comment.id"
                        class="comment-container"
                      >
                        <div class="nickname">{{ comment.nickname }}</div>
                        <div class="comment">{{ comment.comment }}</div>
                      </div>
                    </div>

                    <div class="text-center pt-2">
                      <v-pagination
                        v-model="currentPage"
                        :length="pageCount"
                        @update:model-value="onPageChange"
                        size="x-large"
                        class="custom-page"
                      ></v-pagination>
                    </div>

                    <!-- </div> -->
                  </v-card>
                </v-dialog>
              </div>
              <!-- <div class="description-text">
                <div class="author">{{ $store.state.currentPostAuthor }}</div>
                <div class="description">
                  {{ $store.state.currentPost.description }}
                </div>
              </div> -->
              <div class="current-comment">
                <div
                  v-for="comment in recentComments"
                  :key="comment.id"
                  class="comment-container"
                >
                  <div class="nickname">{{ comment.nickname }}</div>
                  <div class="comment">{{ comment.comment }}</div>
                </div>
              </div>
            </v-card>
          </div>
          <v-card-text>
            <v-text-field
              v-model="commentInput"
              density="compact"
              variant="solo"
              label="댓글 달기..."
              size="x-large"
              append-inner-icon=""
              single-line
              hide-details
              @keydown.enter="sendComment"
            >
              <v-icon
                icon="mdi-chevron-up-box"
                size="100"
                style="
                  transform: scaleX(-1);
                  position: absolute;
                  right: 0;
                  top: 50%;
                  transform: translateY(-50%);
                  cursor: pointer;
                "
                @click="sendComment"
              ></v-icon>
            </v-text-field>
            <v-btn type="submit" hidden></v-btn>
          </v-card-text>
          <v-btn
            id="closeButton"
            type="button"
            @click="closeModal"
            border
            class="text-none"
            variant="text"
          >
            닫기1
          </v-btn>
        </div>
      </template>
    </card>
  </v-dialog>
</template>

<script>
import Card from "../../pages/Card/Card.vue";

import * as Toast from "../../plugins/toast";
export default {
  components: {
    Card,
  },
  created() {
    this.fetchRecentComments();
  },
  data() {
    return {
      recentComments: [],
      allComments: [],
      totalItems: null,
      commentInput: "",
    };
  },

  methods: {
    closeModal() {
      this.$store.commit("toggleShowCommunityModal", false);
    },
    async fetchRecentComments() {
      try {
        // console.log(this.$store.state.communityData);
        const communityId = this.$store.state.communityData.id;

        const response = await this.$axios.get(
          `/api/comment/community/${communityId}?page=${this.currentPage}`,
          {
            withCredentials: true,
          }
        );

        this.recentComments = response.data.currentComments.slice(-2);
        console.log("res.curr: ", response.data.currentComments);
        console.log(this.recentComments);
        this.allComments = response.data.paginatedComments;
        this.totalItems = response.data.totalItemsCount;
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    },
  },
};
</script>
<style scoped>
.card-community {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid lightgray;
  padding: 4rem 4rem;
  border-radius: 5px;
  background: #fefefe;
  width: 3000px;
  height: 2500px;
  text-align: center;
  flex-direction: column;
}

.card-title {
  font-size: 6rem;
  text-align: left;
  padding: 20px;
}
.card-author {
  display: flex;
  font-size: 4rem;

  padding: 50px;
}

.description-sheet {
  width: 2800px;
  height: 1100px;
}
.comment-sheet {
  width: 2800px;
  height: 650px;
  font-size: 4rem;
  text-align: start;
  padding: 20px;
}
.description {
  display: flex;
  font-size: 4rem;

  padding: 50px;
}
.current-comment {
  max-height: 500px;
  overflow-y: auto;
  min-height: 100%;
  padding: 50px;
}
.comment-container {
  display: flex;
  margin-bottom: 10px;
  font-size: 70px;
  text-align: left;
}
.nickname {
  flex: 1;
  font-weight: 500;
}

.comment {
  flex: 2;
  max-width: 2000px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow-y: auto;
  font-weight: 300;
}
:deep(.v-text-field .v-field--single-line input) {
  font-size: 70px;
}
:deep(.v-label) {
  font-size: 70px;
}
</style>
