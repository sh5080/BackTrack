<template>
  <div class="backtrack-generator">
    <form @submit.prevent>
      <v-row>
        <v-row>
          <v-col cols="6">
            <div class="input-group bpm-container">
              <div class="bpm-input-container">
                <div class="bpm-label-container">
                  <label class="bpm-label">BPM:</label>
                </div>
                <div class="bpm-input">
                  <input
                    class="input-field"
                    v-model.number="bpm"
                    type="number"
                    :disabled="!bpmDirectInput"
                    :style="{
                      backgroundColor: bpmDirectInput ? 'white' : 'lightgray',
                    }"
                  />
                </div>
              </div>
              <div class="toggle-container">
                <button class="dropdown-toggle" @click="toggleBpmDropdown">
                  BPM 선택
                  <i :class="['arrow-icon', { open: bpmDropdownOpen }]"></i>
                </button>
                <ul
                  v-if="bpmDropdownOpen"
                  class="dropdown-menu"
                  :style="bpmDropdownStyle"
                >
                  <li
                    v-for="bpm in bpmOptions"
                    :key="bpm"
                    @click="selectBpm(bpm)"
                  >
                    {{ bpm }}
                  </li>
                  <li @click="selectBpmDirectInput">직접입력</li>
                </ul>
              </div>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="input-group measure-container">
              <div class="measure-input-container">
                <div class="measure-label-container">
                  <label class="measure-label">마디수:</label>
                </div>
                <div class="measure-input">
                  <input
                    class="input-field"
                    v-model.number="measure"
                    type="number"
                    :disabled="!measureDirectInput"
                    :style="{
                      backgroundColor: measureDirectInput
                        ? 'white'
                        : 'lightgray',
                    }"
                  />
                </div>
              </div>
              <div class="toggle-container">
                <button class="dropdown-toggle" @click="toggleMeasureDropdown">
                  마디 수 선택
                  <i :class="['arrow-icon', { open: measureDropdownOpen }]"></i>
                </button>
                <ul
                  v-if="measureDropdownOpen"
                  class="dropdown-menu"
                  :style="measureDropdownStyle"
                >
                  <li
                    v-for="measure in measureOptions"
                    :key="measure"
                    @click="selectMeasure(measure)"
                  >
                    {{ measure }} 마디
                  </li>
                  <li @click="selectMeasureDirectInput">직접입력</li>
                </ul>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div
            class="input-group"
            style="
              background-color: #f0f0f0;
              padding: 10px;
              border: 1px solid #ccc;
              font-size: 70px;
            "
          >
            <div class="key-label-container">
              <label class="key-label">Key:</label>
            </div>
            <div class="key-selector">
              <div class="key-grid">
                <button
                  class="key-button"
                  v-for="key in keyOptions"
                  :key="key"
                  @click="toggleButton('selectedKey', key)"
                  :class="{ selected: selectedKey === key }"
                >
                  {{ key }}
                </button>
                <button
                  class="key-button"
                  v-for="modifier_fs in ['b', '#']"
                  :key="modifier_fs"
                  @click="toggleButton('selectedModifier_fs', modifier_fs)"
                  :class="{ selected: selectedModifier_fs === modifier_fs }"
                >
                  {{ modifier_fs }}
                </button>
              </div>
            </div>
            <div class="ext-label-container">
              <label class="ext-label">Extends:</label>
            </div>
            <div class="ext-selector">
              <div class="ext-grid">
                <button
                  class="ext-button"
                  v-for="extend in extendOptions"
                  :key="extend"
                  @click="toggleButton('selectedExtend', extend)"
                  :class="{ selected: selectedExtend === extend }"
                >
                  {{ extend }}
                </button>
                <button
                  class="key-button"
                  v-for="modifier_67 in ['6', '7']"
                  :key="modifier_67"
                  @click="toggleButton('selectedModifier_67', modifier_67)"
                  :class="{ selected: selectedModifier_67 === modifier_67 }"
                >
                  {{ modifier_67 }}
                </button>
                <button
                  class="key-button"
                  v-for="modifier_b5 in ['b5']"
                  :key="modifier_b5"
                  @click="toggleButton('selectedModifier_b5', modifier_b5)"
                  :class="{ selected: selectedModifier_b5 === modifier_b5 }"
                >
                  {{ modifier_b5 }}
                </button>
              </div>
            </div>

            <div class="ext-label-container">
              <label class="ext-label">Tensions:</label>
            </div>
            <div class="ext-selector">
              <div class="ext-grid">
                <button
                  class="key-button"
                  v-for="modifier_tension in [
                    'b9',
                    '9',
                    '#9',
                    '11',
                    '#11',
                    'b13',
                    '13',
                    '#13',
                  ]"
                  :key="modifier_tension"
                  @click="
                    toggleButton('selectedModifier_tension', modifier_tension)
                  "
                  :class="{
                    selected: selectedModifier_tension === modifier_tension,
                  }"
                >
                  {{ modifier_tension }}
                </button>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div
            class="input-group"
            style="
              background-color: #f0f0f0;
              padding: 100px;
              border: 1px solid #ccc;
              font-size: 70px;
            "
          >
            <v-row class="align-center">
              <v-col cols="4" style="text-align: right">
                <label class="key-label">Chord:</label>
              </v-col>
              <v-col cols="3">
                <div class="chord-list">
                  <span
                    class="chord"
                    v-for="chord in resultChords"
                    :key="chord"
                  >
                    {{ chord }}
                  </span>
                </div>
              </v-col>

              <v-col cols="2" style="text-align: left">
                <button class="register-button" @click="registerBacktrack">
                  등록
                </button>
              </v-col>
            </v-row>
            <!-- dd -->
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div
            class="input-group"
            style="
              background-color: #f0f0f0;
              padding: 10px;
              border: 1px solid #ccc;
              font-size: 500%;
            "
          >
            <v-col cols="0" style="display: flex max-width: 200%;">
              <label class="key-label">Preview:</label>
              <div class="chord-list">
                <span
                  class="chord"
                  v-for="chord in selectedChords"
                  :key="chord"
                >
                  {{ chord }}
                </span>
              </div>
            </v-col>
            <v-col cols="3" style="display: flex; justify-content: flex-end">
              <div class="auth-container">
                <div class="button-container">
                  <button class="reset-button" @click="removeSelections">
                    지우기
                  </button>
                  <button class="reset-button" @click="resetSelections">
                    초기화
                  </button>
                </div>
              </div>
            </v-col>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div
            class="input-group"
            style="
              background-color: #f0f0f0;
              padding: 10px;
              border: 1px solid #ccc;
              font-size: 500%;
            "
          >
            <button
              class="generate-button"
              type="button"
              @click="generateBacktrack"
            >
              Backingtrack 생성하기
            </button>
          </div>
        </v-col>
      </v-row>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import * as Toast from "../plugins/toast";
// import HeaderSection from "@/components/HeaderSection.vue";
// import Login from "@/components/LoginModal.vue";

export default {
  components: {
    // Login,
    // HeaderSection,
  },

  data() {
    return {
      keyOptions: ["C", "D", "E", "F", "G", "A", "B"],
      extendOptions: ["min", "mM", "sus4", "dim", "hdim", "aug"],
      selectedExtend: "",
      selectedKey: "",
      selectedModifier_fs: "",
      selectedModifier_67: "",
      selectedModifier_b5: "",
      selectedModifier_tension: "",
      previewChords: [],
      selectedChords: [],
      bpm: 60,
      measure: 4,
      bpmDropdownOpen: false,
      measureDropdownOpen: false,
      bpmDirectInput: false,
      measureDirectInput: false,
      measureOptions: [4, 8, 16, 32],
      bpmOptions: [60, 90, 120, 180],
      selectedMeasure: 4,
      selectedBpm: 60,
      backtrack: null,
      bpmDropdownStyle: {},
      measureDropdownStyle: {},
      resultChords: [],
      // showLoginModal: false,
    };
  },
  watch: {
    measure(newValue) {
      this.selectedMeasure = newValue;
    },
    bpm(newValue) {
      this.selectedBpm = newValue;
    },
  },
  methods: {
    errorMessage() {},
    openMyPage() {
      this.$router.push("/myPage");
    },
    toggleBpmDropdown(event) {
      this.bpmDropdownOpen = !this.bpmDropdownOpen;
      if (this.bpmDropdownOpen) {
        const buttonRect = event.target.getBoundingClientRect();
        this.bpmDropdownStyle = {
          top: `${buttonRect.bottom}px`,
          left: `${buttonRect.left}px`,
        };
      } else {
        this.bpmDropdownStyle = {};
      }
    },

    toggleMeasureDropdown(event) {
      this.measureDropdownOpen = !this.measureDropdownOpen;
      if (this.measureDropdownOpen) {
        const buttonRect = event.target.getBoundingClientRect();
        this.measureDropdownStyle = {
          top: `${buttonRect.bottom}px`,
          left: `${buttonRect.left}px`,
        };
      } else {
        this.measureDropdownStyle = {};
      }
    },
    selectMeasureDirectInput() {
      this.measureDirectInput = true;
      this.selectedMeasure = "";
      this.measure = "";
      this.measureDropdownOpen = false;
    },
    selectBpmDirectInput() {
      this.bpmDirectInput = true;
      this.selectedBpm = "";
      this.bpm = "";
      this.bpmDropdownOpen = false;
    },
    selectMeasure(measure) {
      if (this.measureDirectInput) {
        this.selectedMeasure = measure;
        this.measureDropdownOpen = false;
        this.measureDirectInput = false;
      } else {
        this.measure = measure;
        this.selectedMeasure = measure;
        this.measureDropdownOpen = false;
      }
    },
    selectBpm(bpm) {
      if (this.bpmDirectInput) {
        this.selectedBpm = bpm;
        this.bpmDropdownOpen = false;
        this.bpmDirectInput = false;
      } else {
        this.bpm = bpm;
        this.selectedbpm = bpm;
        this.bpmDropdownOpen = false;
      }
    },

    toggleButton(prop, value) {
      if (this[prop] === value) {
        //지울 때
        this[prop] = "";

        this.testRemoveArr(prop, value);
        this.resultChords = this.resultChords.filter((chord) => chord !== "");
      } else {
        //만들 때
        this[prop] = value;
        if (prop === "selectedKey" && this.resultChords[0] === undefined) {
          this.testAddArr(value);
        }
        if (prop === "selectedKey" && this.resultChords.length > 0) {
          this.resultChords = [];
          this.testAddArr(value);
        }
        if (
          (prop === "selectedModifier_fs" &&
            this.resultChords[0] === undefined) ||
          (prop === "selectedExtend" && this.resultChords[0] === undefined) ||
          (prop === "selectedModifier_67" &&
            this.resultChords[0] === undefined) ||
          (prop === "selectedModifier_b5" &&
            this.resultChords[0] === undefined) ||
          (prop === "selectedModifier_tension" &&
            this.resultChords[0] === undefined)
        ) {
          Toast.customError("Key를 먼저 선택해주세요.");
        }

        if (
          prop === "selectedModifier_fs" &&
          this.resultChords[0] !== undefined
        ) {
          // selectedModifier_fs의 value(b 또는 #)를 추가하거나 교체
          const currentValue = this.resultChords[0];
          const newValue = currentValue.replace(/[#b]/g, "") + value;
          this.resultChords.splice(0, 1, newValue); // 요소를 newValue로 교체
        }
        if (
          prop === "selectedExtend" &&
          this.resultChords[0] &&
          this.resultChords[1] === undefined
        ) {
          this.testAddArr(value);
        }
        if (
          prop === "selectedExtend" &&
          this.resultChords[1] !== undefined &&
          this.resultChords[0]
        ) {
          this.resultChords.splice(1, 1, value);
        }

        if (
          (value === "6" && this.resultChords[0] !== undefined) ||
          (value === "7" && this.resultChords[0] !== undefined)
        ) {
          // 6 또는 7 버튼일 경우
          if (
            this.resultChords.includes("6") ||
            this.resultChords.includes("7")
          ) {
            // 이미 6 또는 7 버튼이 있는 경우 교체
            const index =
              this.resultChords.indexOf("6") !== -1
                ? this.resultChords.indexOf("6")
                : this.resultChords.indexOf("7");
            this[prop] = value;
            this.resultChords.splice(index, 1, value);
          } else {
            // 6 또는 7 버튼이 없는 경우 추가
            this[prop] = value;
            this.testAddArr(value);
          }
        }
        if (value === "b5" && this.resultChords[0] !== undefined) {
          this[prop] = value;
          this.testAddArr(value);
        }
        if (
          ["b9", "9", "#9"].includes(value) &&
          this.resultChords[0] !== undefined
        ) {
          // b9, 9, #9 버튼일 경우
          const replaceableValues = ["b9", "9", "#9"];
          if (
            replaceableValues.some((replaceValue) =>
              this.resultChords.includes(replaceValue)
            )
          ) {
            // 이미 교체 가능한 버튼이 있는 경우 교체
            const index = replaceableValues.reduce((acc, replaceValue) => {
              const replaceIndex = this.resultChords.indexOf(replaceValue);
              return replaceIndex !== -1 ? replaceIndex : acc;
            }, -1);

            this[prop] = value;
            this.resultChords.splice(index, 1, value);
          } else {
            // 교체 가능한 버튼이 없는 경우 추가
            this[prop] = value;
            this.testAddArr(value);
          }
        }
        if (
          ["11", "#11"].includes(value) &&
          this.resultChords[0] !== undefined
        ) {
          const replaceableValues = ["11", "#11"];
          if (
            replaceableValues.some((replaceValue) =>
              this.resultChords.includes(replaceValue)
            )
          ) {
            // 이미 교체 가능한 버튼이 있는 경우 교체
            const index = replaceableValues.reduce((acc, replaceValue) => {
              const replaceIndex = this.resultChords.indexOf(replaceValue);
              return replaceIndex !== -1 ? replaceIndex : acc;
            }, -1);

            this[prop] = value;
            this.resultChords.splice(index, 1, value);
          } else {
            // 교체 가능한 버튼이 없는 경우 추가
            this[prop] = value;
            this.testAddArr(value);
          }
        }
        if (
          ["b13", "13", "#13"].includes(value) &&
          this.resultChords[0] !== undefined
        ) {
          const replaceableValues = ["b13", "13", "#13"];
          if (
            replaceableValues.some((replaceValue) =>
              this.resultChords.includes(replaceValue)
            )
          ) {
            // 이미 교체 가능한 버튼이 있는 경우 교체
            const index = replaceableValues.reduce((acc, replaceValue) => {
              const replaceIndex = this.resultChords.indexOf(replaceValue);
              return replaceIndex !== -1 ? replaceIndex : acc;
            }, -1);

            this[prop] = value;
            this.resultChords.splice(index, 1, value);
          } else {
            // 교체 가능한 버튼이 없는 경우 추가
            this[prop] = value;
            this.testAddArr(value);
          }
        }

        this.resultChords = this.resultChords.filter((chord) => chord !== "");
        this[prop] = value;
      }
    },

    testAddArr(value) {
      this.resultChords = this.resultChords.filter((chord) => chord !== ""); // 빈 요소 제거
      this.resultChords.push(value); // 값을 배열에 추가
    },
    testRemoveArr(prop, value) {
      if (prop === "selectedKey") {
        this.resultChords = [];
      } else
        for (let i = 0; i < this.resultChords.length; i++) {
          if (this.resultChords[i].includes(value)) {
            // 검색 문자열이 포함된 요소를 찾았을 때
            const newValue = this.resultChords[i].replace(value, ""); // # 제거
            this.resultChords.splice(i, 1, newValue); // 요소를 newValue로 교체
            break; // 원하는 요소를 찾았으므로 반복문 종료
          }
        }
    },

    registerBacktrack() {
      const chord = this.resultChords.join("");
      this.selectedChords.push(chord);
      return this.selectedChords;
    },
    removeSelections() {
      this.selectedChords.pop();
    },
    resetSelections() {
      this.selectedChords = [];
    },
    openLoginModal() {
      this.$store.commit("toggleLoginModal", true);
    },

    closeLoginModal() {
      this.$store.commit("toggleLoginModal", false);
    },

    async generateBacktrack() {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/backtrack",
          {
            bpm: this.selectedBpm,
            measures: this.selectedMeasure,
            chordPattern: this.selectedChords,
          },
          { withCredential: true }
        );

        Toast.alertMessage(
          "성공적으로 완료되었습니다. 잠시 후 백킹트랙이 생성됩니다."
        );
        this.backtrack = response.data.backtrack;
      } catch (error) {
        console.error("Error generating backtrack:", error);
        if (
          error.response.data.message ===
          "필수 입력값이 누락되었습니다: bpm, measures"
        ) {
          Toast.customError("BPM, 마디수를 확인해 주세요.");
        } else if (
          error.response.data.message === "필수 입력값이 누락되었습니다: bpm"
        ) {
          Toast.customError("BPM을 선택하거나 입력해 주세요.");
        } else if (
          error.response.data.message ===
          "필수 입력값이 누락되었습니다: measures"
        ) {
          Toast.customError("마디수를 선택하거나 입력해 주세요.");
        } else Toast.errorMessage(error);
      }
    },
  },
};
</script>

<style scoped>
#app {
  overflow: hidden;
}

.input-group {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  overflow: hidden;
  font-size: 70px;
}

.input-group-label {
  display: flex;
}
.measure-label-container,
.ext-label-container,
.key-label-container,
.bpm-label-container {
  display: flex;
  align-items: center;
  margin-right: 40px;
  /* padding: 80px; */
}
.toggle-container,
.bpm-container,
.measure-container,
.measure-input-container,
.bpm-input-container {
  display: flex;
  align-items: center;
}
.ext-label,
.key-label,
.bpm-label {
  margin-right: 5px;
}
.ext-selector,
.key-selector {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.ext-grid,
.key-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  /* border: 1px solid; */
}

.ext-button,
.key-button {
  background-color: #0c63e4;
  color: #fff;
  border: 1px solid #ccc;
  padding: 5px 10px;
  margin-right: 20px;
  border-radius: 4px;
  cursor: pointer;
}
.ext-button.selected,
.key-button.selected {
  background-color: #084dbf;
}

.key-button:hover {
  background-color: #084dbf;
}
.auth-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.button-container {
  display: flex;
  justify-content: flex-end !important;
  align-items: center;
}
.welcome-message {
  display: flex;
  margin-top: 15px;
  margin-right: 25px;
  align-items: center;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  /* 드롭다운 토글 버튼 스타일링 */
  background-color: #0c63e4;
  color: white;
  border: #0c63e4;
  padding: 8px 12px;
  cursor: pointer;
  width: 400px;
  height: 130px;
}
.dropdown-menu {
  /* 드롭다운 메뉴 스타일링 */
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  list-style-type: none;
  padding: 0;
  margin: 0;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
}

.dropdown-menu li {
  padding: 8px;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background-color: #f2f2f2;
}
.result {
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
}
.chord-list {
  display: flex;
  flex-wrap: wrap;
}

.chord {
  /* Add your styling for chord items */
  margin-right: 10px;
  margin-bottom: 10px;
}

.backtrack-generator {
  /* max-width: 3000px; */
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.backtrack-generator form {
  display: flex;
  flex-direction: column;
}

.backtrack-generator label {
  margin-bottom: 10px;
  font-weight: bold;
}

.backtrack-generator input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 4px;
}

.backtrack-generator button {
  margin-top: 10px;
  color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  background: linear-gradient(to top, #00b869, #03c75a);
}

.backtrack-generator button:hover {
  background-color: #084dbf;
}

.backtrack-generator ul {
  margin-top: 20px;
  list-style: none;
  padding: 0;
}

.backtrack-generator li {
  margin-bottom: 6px;
}
</style>
