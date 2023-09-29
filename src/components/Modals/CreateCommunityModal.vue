<template>
  <v-dialog
    v-if="isLogged"
    v-model="$store.state.showCreateCommunityModal"
    persistent=""
  >
    <card class="card-community">
      <template v-slot:header>
        <h4 class="card-title">게시글 생성</h4>
      </template>

      <div class="card-body">
        <div class="description-sheet">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <!-- <v-textarea
                    v-model="title"
                    class="title-area"
                    label="제목*"
                    required
                    rows="1"
                  ></v-textarea> -->
                  <v-text-field
                    v-model="title"
                    label="제목*"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="description"
                    class="description-area"
                    variant="solo"
                    label="게시글*"
                    :hint="` (${description.length}/1000)`"
                    persistent-hint
                    required
                    rows="4"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </div>
      </div>

      <template v-slot:footer>
        <div class="custom-footer">
          <div style="display: flex; justify-content: flex-end">
            <v-btn
              id="closeButton"
              type="button"
              @click="createCommunity"
              border
              class="text-none"
              variant="text"
              color="success"
            >
              올리기
            </v-btn>

            <v-btn
              id="closeButton"
              type="button"
              @click="closeModal"
              border
              class="text-none"
              variant="text"
            >
              닫기
            </v-btn>
          </div>
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
  computed: {
    isLogged() {
      return !!this.$store.state.loggedInNickname;
    },
  },

  data() {
    return {
      totalItems: null,
      title: "",
      description: "",
    };
  },

  methods: {
    closeModal() {
      this.$store.commit("toggleShowCreateCommunityModal", false);
    },
    async createCommunity() {
      if (this.description.length === 0) {
        Toast.customError("게시글을 입력해주세요.");
        return;
      }
      if (this.description.length > 1000) {
        Toast.customError("1000자 이내로 입력이 가능합니다.");
        return;
      }
      const response = await this.$axios.post(
        `/api/community`,
        {
          title: this.title,
          description: this.description,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        Toast.alertMessage("게시글 업로드가 완료되었습니다.");
        setTimeout(() => {
          this.$router.go();
        }, 2000);
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
#closeButton {
  background-color: #fefefe;
  font-size: 4rem;
  height: 150px;
  width: 300px;
}
.card-title {
  font-size: 6rem;
  text-align: left;
  padding: 20px;
  font-weight: 400;
  height: 150px;
  display: flex;
  align-items: center;
}

.description-sheet {
  /* width: 2800px;
  height: 1100px; */
}

.description {
  display: flex;
  font-size: 3rem;

  padding: 50px;
}

:deep(
    .v-input--density-default
      .v-field--variant-filled
      .v-label.v-field-label--floating,
    .v-label.v-field-label
  ) {
  font-size: 3rem;
}
:deep(.v-label) {
  font-size: 3rem;
}
:deep(.v-input__details) {
  overflow: visible;
  text-align: right;
}
:deep(.v-messages) {
  font-size: 3rem;
  top: 20px;
}
:deep(.v-textarea .v-field--active textarea) {
  font-size: 5rem;
  height: 1500px;
  padding: 50px;
}

.titel-area {
  font-size: 5rem;
  /* height: 300px; */
}
:deep(.v-textarea .v-field__field),
.description-area {
  font-size: 5rem;
  height: 1500px;
}

:deep(.v-input--density-default .v-field--variant-outlined) {
  font-size: 4rem;
}
</style>
