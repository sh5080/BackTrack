<template>
  <div class="table-container">
    <v-data-table
      :headers="headers"
      :items="posts"
      :items-per-page="10"
      class="mx-auto table"
      style="
        font-size: 60px;
        margin-top: 100px;
        /* max-height: 1775px; */
        height: 1775px;
        width: 2500px;
      "
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title style="font-size: 5rem">실시간 랭킹</v-toolbar-title>
        </v-toolbar>
      </template>

      <template v-slot:item="item">
        <tr>
          <td>{{ item.index + 1 }}</td>
          <td>
            {{
              item.item.selectable.likedUsers
                ? item.item.selectable.likedUsers.length
                : ""
            }}
          </td>
          <td>{{ item.item.selectable.title }}</td>
          <td>{{ item.item.selectable.author }}</td>
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
        { title: "누적 좋아요", key: "likedUsers.length", sortable: false },
        { title: "제목", key: "title", sortable: false },
        { title: "작성자", key: "author", sortable: false },
      ],
      posts: [],
      currentPage: 1,
    };
  },
  created() {
    this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await this.$axios.get(
          `/api/post?page=${this.currentPage}&sortBy=likes&option=rank`,
          {
            withCredentials: true,
          }
        );

        this.posts = response.data.postData.paginatedPosts;
        console.log("여기: ", response.data);
        this.totalItems = response.data.postData.totalItemsCount;
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },
  },
};
</script>

<style scoped>
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
</style>
