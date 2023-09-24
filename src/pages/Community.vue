<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <card class="card-community">
          <div class="author">
            <h4 class="title">커뮤니티</h4>
            <div class="user-info">
              <div class="info-item">
                <v-data-table
                  :currentPage="currentPage"
                  :headers="headers"
                  :items="communityPosts"
                  :items-per-page="itemsPerPage"
                  hide-default-footer
                  style="
                    font-size: 50px;
                    margin-top: 100px;
                    max-height: 1775px;
                    height: 1775px;
                  "
                >
                  <template v-slot:item="{ item, index }">
                    <tr style="height: 180px">
                      <td>
                        {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                      </td>
                      <td>{{ item.selectable.title }}</td>
                      <td>{{ item.selectable.author }}</td>
                      <td>
                        {{
                          new Date(item.selectable.createdAt)
                            .toISOString()
                            .split("T")[0]
                        }}
                      </td>
                    </tr>
                  </template>

                  <template v-slot:bottom> </template>
                </v-data-table>

                <v-pagination
                  v-model="currentPage"
                  :length="pageCount"
                  @update:model-value="onPageChange"
                  size="x-large"
                  class="page"
                ></v-pagination>
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
                          <v-list-item-title
                            style="font-size: 70px; line-height: 5.5rem"
                            >{{ item.text }}</v-list-item-title
                          >
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
                          @keyup.enter="
                            fetchCommunityPosts(searchValue, selectedSearch)
                          "
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
                          {{ selectedSortPosts }}
                          <v-icon>mdi-chevron-down</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          v-for="(item, index) in sortOptions"
                          style="height: 150px"
                          :key="index"
                          @click="sortedCommunityPosts(item.value)"
                        >
                          <v-list-item-title
                            style="font-size: 70px; line-height: 5.5rem"
                            >{{ item.text }}</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                </div>
              </div>
            </div>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
import Card from "./Card/Card.vue";

export default {
  components: {
    Card,
  },
  computed: {
    selectedSortPosts() {
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
    this.fetchCommunityPosts();
  },
  data() {
    return {
      totalItems: 0,
      currentPage: 1,
      itemsPerPage: 10,
      headers: [
        { title: "No", key: "id", width: "300px" },
        { title: "제목", key: "title" },
        { title: "작성자", key: "author", width: "600px" },
        { title: "생성일자", key: "createdAt", width: "300px" },
      ],
      communityPosts: [],
      sortOptions: [
        { text: "최신순", value: "latest" },
        { text: "오래된순", value: "oldest" },
        // { text: "좋아요 순", value: "likes" },
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
  methods: {
    sortedCommunityPosts(value) {
      this.selectedSort = value;
      this.fetchCommunityPosts();
    },
    sortedSearch(value) {
      this.selectedSearch = value;
      this.fetchCommunityPosts(value);
    },
    onPageChange(newPage) {
      this.currentPage = newPage;
      this.fetchCommunityPosts(this.searchValue, this.selectedSearch);
    },
    async fetchCommunityPosts(value, option) {
      try {
        let apiUrl = `/api/community?page=${this.currentPage}`;

        if (this.selectedSort === "oldest") {
          apiUrl += "&sortBy=oldest";
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

        const communityData = response.data;

        this.communityPosts = communityData.communityData.paginatedCommunities;
        this.totalItems = communityData.communityData.totalItemsCount;
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },
    async example(item) {
      console.log("여기: ", item);
    },
  },
};
</script>
<style scoped>
.card-community {
  overflow: hidden;
  width: 100%;

  height: 3000px;
}
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
  /* border-top: 1px solid #ccc; */
  margin-top: 150px;
  margin-bottom: 100px;
}

.info-item {
  position: relative;
  margin-top: 100px;
  margin-bottom: 10px;
  border-top: 1px solid #ccc;
}

.info-label {
  display: inline-block;
  width: 600px;
  font-size: 75px;
  font-weight: 400;
  margin-top: 70px;
}

.info-value {
  display: inline-block;
  font-size: 70px;
  width: 1250px;
  margin-left: 10px;
}

.page-container {
  display: flex;
}

:deep(.v-text-field .v-field--single-line input) {
  height: 150px;
  font-size: 70px;
}

:deep(.v-pagination .v-btn) {
  font-size: 50px;
  width: 100px;
  height: 100px;
  margin-top: 300px;
}
:deep(.v-field--center-affix .v-field__append-inner) {
  font-size: 50px;
}
</style>
