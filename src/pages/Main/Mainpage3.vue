<template>
  <div class="table-container">
    <div class="current-time">{{ formattedDate }}</div>
    <div class="table-header-container">
      <v-btn class="table-header" @click="showTable('totalFamousPost')"
        >인기 게시물</v-btn
      >
      <v-btn class="table-header" @click="showTable('totalFamousUser')"
        >인기 사용자</v-btn
      >
    </div>
    <v-data-table
      v-if="currentTable === 'totalFamousPost'"
      :items="posts"
      :items-per-page="10"
      class="mx-auto table"
      style="
        font-size: 60px;
        /* margin-top: 100px; */
        /* max-height: 1775px; */
        height: 1775px;
        width: 2100px;
        align-content: center;
      "
    >
      <template v-slot:item="item">
        <tr>
          <td>
            <v-row class="rank-row">
              <v-col cols="3" class="rank-number">
                <span class="table-rank">
                  {{ item.index + 1 }}
                </span>
              </v-col>

              <v-col cols="6" class="rank-left">
                <span class="table-title">{{
                  item.item.selectable.title
                }}</span>
                <span class="table-author">{{
                  item.item.selectable.author
                }}</span>
              </v-col>
              <v-col cols="3" class="rank-right">
                <span class="table-likedCount">
                  <v-icon size="small" :color="'surface-variant'"
                    >mdi-heart</v-icon
                  >
                  {{
                    item.item.selectable.likedUsers
                      ? item.item.selectable.likedUsers.length
                      : ""
                  }}
                </span>
              </v-col>
            </v-row>
          </td>
        </tr>
      </template>
      <template v-slot:bottom></template>
    </v-data-table>

    <v-data-table
      v-if="currentTable === 'totalFamousUser'"
      :items="users"
      :items-per-page="10"
      class="mx-auto table"
      style="
        font-size: 60px;
        /* margin-top: 100px; */
        /* max-height: 1775px; */
        height: 1775px;
        width: 2100px;
        align-content: center;
      "
    >
      <template v-slot:item="item">
        <tr>
          <td>
            <v-row class="rank-row">
              <v-col cols="3" class="rank-number">
                <span class="table-rank">
                  {{ item.index + 1 }}
                </span>
              </v-col>

              <v-col cols="6" class="rank-left">
                <span class="table-title">{{
                  item.item.selectable.nickname
                }}</span>
                <span class="table-author">{{
                  item.item.selectable.mostLikedPost
                    ? item.item.selectable.mostLikedPost
                    : ""
                }}</span>
              </v-col>
              <v-col cols="3" class="rank-right">
                <span class="table-likedCount">
                  <v-icon size="small" :color="'surface-variant'"
                    >mdi-heart</v-icon
                  >
                  {{
                    item.item.selectable.totalLikes
                      ? item.item.selectable.totalLikes
                      : ""
                  }}
                </span>
              </v-col>
            </v-row>
          </td>
        </tr>
      </template>
      <template v-slot:bottom></template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { title: "등수", key: "index+1", sortable: false },
        { title: "좋아요", key: "likedUsers.length", sortable: false },
      ],
      posts: [],
      users: [],
      currentPage: 1,
      currentTime: new Date(),
      currentTable: "totalFamousPost",
    };
  },
  computed: {
    formattedDate() {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      return this.currentTime
        .toLocaleDateString("ko-KR", options)
        .replace(/\./g, "-")
        .replace(/\s/g, " ")
        .replace(/-/g, "");
    },
  },
  created() {
    this.fetchPosts();
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  },
  methods: {
    async fetchPosts() {
      try {
        if (this.currentTable === "totalFamousPost") {
          const response = await this.$axios.get(
            `/api/post?page=${this.currentPage}&sortBy=likes&option=rankPost`,
            {
              withCredentials: true,
            }
          );
          this.posts = response.data.resultData.paginatedPosts;
          this.totalItems = response.data.resultData.totalItemsCount;
        } else if (this.currentTable === "totalFamousUser") {
          const response = await this.$axios.get(
            `/api/post?page=${this.currentPage}&sortBy=likes&option=rankUser`,
            {
              withCredentials: true,
            }
          );
          this.users = response.data.resultData.paginatedUsers;
          this.totalItems = response.data.resultData.totalItemsCount;
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },
    showTable(table) {
      this.currentTable = table;
      this.fetchPosts();
    },
  },
};
</script>

<style scoped>
.table-container {
  font-family: "Noto Sans", sans-serif;
}

:deep(.v-toolbar__content) {
  height: 200px !important;
}
:deep(.v-toolbar-title__placeholder) {
  overflow: visible;
}
.table {
  position: relative;
  text-align: center;
  z-index: 100;
}
:deep(.v-data-table-header__content) {
  justify-content: center;
}
.table tr:hover {
  transform: scale(1.05);
  transition: transform 0.3s;
  z-index: 1 !important;
  max-width: none;
}

:deep(.v-table__wrapper) {
  overflow: hidden;
  width: 2000px;
  margin: 0 auto;
}
.current-time {
  font-size: 5rem;
  display: flex;
  justify-content: center;
  margin-top: 100px;
}
.table-header-container {
  display: flex;
  justify-content: center;
}
.table-header {
  width: 1050px !important;
  font-size: 4rem !important;
}
.rank-left {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.rank-number,
.rank-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.table-rank {
  display: flex;
  justify-content: center;
}
.table-title {
  font-size: 4rem;
}
.table-author {
  font-size: 3rem;
}
.rank-row {
  height: 195px;
  max-height: 200px;
}
</style>
