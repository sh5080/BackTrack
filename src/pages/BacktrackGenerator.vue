<template>
  <div class="backtrack-generator">
    <form @submit.prevent>
      <v-row>
        <v-col cols="4">
          <div class="input-group1 bpm-container">
            <div class="bpm-input-container">
              <div class="bpm-label-container">
                <label class="bpm-label">BPM:</label>
              </div>
              <div class="bpm-input">
                <input
                  class="input-field"
                  v-model.number="bpm"
                  :readonly="!bpmDirectInput"
                  :style="{
                    backgroundColor: bpmDirectInput ? 'white' : 'lightgray',
                  }"
                />
              </div>

              <button class="dropdown-toggle1" @click="toggleBpmDropdown">
                BPM 선택
              </button>

              <div class="menu-container" v-if="bpmDropdownOpen">
                <ul class="dropdown-menu1">
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

            <div class="measure-input-container">
              <div class="measure-label-container">
                <label class="measure-label" style="margin-left: -32px"
                  >마디수:</label
                >
              </div>
              <div class="measure-input">
                <input
                  class="input-field"
                  v-model.number="measure"
                  :readonly="!measureDirectInput"
                  :style="{
                    backgroundColor: measureDirectInput ? 'white' : 'lightgray',
                  }"
                />
              </div>

              <button class="dropdown-toggle1" @click="toggleMeasureDropdown">
                마디 수 선택
              </button>
              <div class="menu-container" v-if="measureDropdownOpen">
                <ul class="dropdown-menu2">
                  <li
                    v-for="measure in measureOptions"
                    :key="measure"
                    @click="selectMeasure(measure)"
                  >
                    {{ measure }}
                  </li>
                  <li @click="selectMeasureDirectInput">직접입력</li>
                </ul>
              </div>
            </div>
          </div>
          <v-col>
            <div class="input-group2">
              <v-col cols="6">
                <div class="key-label-container">
                  <label class="key-label">Key</label>
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
              </v-col>

              <v-col cols="6">
                <div class="ext-label-container">
                  <label class="ext-label">Extends</label>
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
                      :class="{
                        selected: selectedModifier_67 === modifier_67,
                      }"
                    >
                      {{ modifier_67 }}
                    </button>
                    <button
                      class="key-button"
                      v-for="modifier_b5 in ['b5']"
                      :key="modifier_b5"
                      @click="toggleButton('selectedModifier_b5', modifier_b5)"
                      :class="{
                        selected: selectedModifier_b5 === modifier_b5,
                      }"
                    >
                      {{ modifier_b5 }}
                    </button>
                  </div>
                </div>
              </v-col>
            </div>
          </v-col>
          <div class="input-group2" style="margin-left: 40px">
            <v-col cols="6">
              <div class="ext-label-container">
                <label class="ext-label">Tensions</label>
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
                  <button class="register-button" @click="registerBacktrack">
                    등록
                  </button>
                </div>
              </div>
            </v-col>
            <v-col>
              <div class="chord-container">
                <v-col>
                  <div class="ext-label-container">
                    <label class="key-label">Chord</label>
                  </div>
                </v-col>
                <v-col>
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
              </div>
            </v-col>
          </div>
        </v-col>

        <v-col cols="6">
          <div class="input-group3">
            <!-- dd -->
            <label class="key-label">Preview:</label>
            <v-col cols="11">
              <!-- <div class="chord-list2">
                <span
                  class="chords"
                  v-for="chord in selectedChords"
                  :key="chord"
                >
                  {{ chord }}
                  <br v-if="(index + 1) % 3 === 0 && chord === '|'" />
                </span>
              </div> -->
              <!-- <div class="table-container">
                <div
                  v-for="(tableIndex) in tableRows"
                  :key="tableIndex"
                  class="table-container"
                >
                  <table class="chord-table">
                    <tr>
                      <td
                        v-for="(col, colIndex) in tableCols"
                        :key="col"
                        class="chord-cell"
                        contenteditable
                      >
                        <div class="chord-content">
                   
                          {{
                            getChordAt(currentTableIndex * tableCols + colIndex)
                          }}
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </div> -->

              <div class="table-container">
                <div
                  v-for="(table, tableIndex) in tables"
                  :key="tableIndex"
                  class="table-container"
                >
                  <table class="chord-table">
                    <tr>
                      <td
                        v-for="(col, colIndex) in tableCols"
                        :key="colIndex"
                        class="chord-cell"
                        contenteditable
                      >
                        <div class="chord-content">
                          {{ getChordAt(tableIndex, colIndex) }}
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="preview-container">
                <div class="fix-container">
                  <button class="reset-button" @click="addSelections">
                    마디 추가
                  </button>
                  <button class="reset-button" @click="removeSelections">
                    지우기
                  </button>
                  <button class="reset-button" @click="resetSelections">
                    초기화
                  </button>
                </div>
                <div class="generate-container">
                  <button
                    class="generate-button"
                    type="button"
                    @click="generateBacktrack"
                  >
                    Backingtrack 생성하기
                  </button>
                </div>
              </div>
            </v-col>
          </div>
        </v-col>

        <v-col cols="12">
          <div class="input-group4"></div>
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
import { ref } from "vue";
export default {
  components: {
    // Login,
    // HeaderSection,
  },

  // setup() {
  //   const selectedChords = ref([]);
  //   const currentTableIndex = ref(0);

  //   function registerBacktrack() {
  //     if (this.resultChords.length === 0) {
  //       Toast.customError("코드를 먼저 만들어주세요.");
  //       return;
  //     }
  //     const chord = this.resultChords.join("");

  //     // 첫 번째 테이블의 첫 번째 칸에만 등록
  //     if (currentTableIndex.value === 0) {
  //       selectedChords.value[0] = chord;
  //     }

  //     this.resultChords = [];
  //     this.selectedExtend = "";
  //     this.selectedKey = "";
  //     this.selectedModifier_fs = "";
  //     this.selectedModifier_67 = "";
  //     this.selectedModifier_b5 = "";
  //     this.selectedModifier_tension = "";

  //     // 다음 테이블로 넘어가기
  //     currentTableIndex.value++;
  //     if (currentTableIndex.value >= this.tableRows) {
  //       currentTableIndex.value = 0;
  //     }
  //   }

  //   function getChordAt(index) {
  //     if (index >= selectedChords.value.length) {
  //       return "";
  //     }
  //     return selectedChords.value[index];
  //   }

  //   return {
  //     // ...,
  //     selectedChords,
  //     registerBacktrack,
  //     getChordAt,
  //     currentTableIndex,
  //   };
  // },

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
      tableCols: 4,
      currentTableIndex: 0,
      tables: [0],
    };
  },
  computed: {
    tableRows() {
      return Math.ceil(this.selectedMeasure / this.tableCols);
    },
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
    closeDropdown() {
      this.bpmDropdownOpen = false;
      this.measureDropdownOpen = false;
    },
    toggleBpmDropdown() {
      this.bpmDropdownOpen = !this.bpmDropdownOpen;
    },

    toggleMeasureDropdown() {
      this.measureDropdownOpen = !this.measureDropdownOpen;
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
    selectBpm(bpm) {
      this.bpmDropdownOpen = false;
      this.bpm = bpm;
      this.selectedBpm = bpm;
      if (this.bpmDirectInput) {
        this.bpmDirectInput = false;
      }
    },

    selectMeasure(measure) {
      this.measureDropdownOpen = false;
      this.measure = measure;
      this.selectedMeasure = measure;
      if (this.measureDirectInput) {
        this.measureDirectInput = false;
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
    // registerBacktrack() {
    //   if (this.resultChords.length === 0) {
    //     Toast.customError("코드를 먼저 만들어주세요.");
    //     return;
    //   }
    //   const chord = this.resultChords.join("");
    //   this.selectedChords.push(chord);
    //   this.resultChords = [];
    //   (this.selectedExtend = ""),
    //     (this.selectedKey = ""),
    //     (this.selectedModifier_fs = ""),
    //     (this.selectedModifier_67 = ""),
    //     (this.selectedModifier_b5 = ""),
    //     (this.selectedModifier_tension = "");

    //   return this.selectedChords;
    // },
    registerBacktrack() {
      if (this.resultChords.length === 0) {
        Toast.customError("코드를 먼저 만들어주세요.");
        return;
      }
      const chord = this.resultChords.join("");

      // 현재 테이블의 첫 번째 칸에만 등록
      const currentTable = this.tables[this.currentTableIndex];
      if (!currentTable) {
        this.tables[this.currentTableIndex] = [chord];
      } else if (currentTable.length < this.tableCols) {
        currentTable.push(chord);
      } else {
        // 현재 테이블이 꽉 찼으면 다음 테이블로 넘어가기
        this.currentTableIndex =
          (this.currentTableIndex + 1) % this.selectedMeasure;
        this.tables[this.currentTableIndex] = [chord];
      }
      this.resultChords = [];
      this.selectedExtend = "";
      this.selectedKey = "";
      this.selectedModifier_fs = "";
      this.selectedModifier_67 = "";
      this.selectedModifier_b5 = "";
      this.selectedModifier_tension = "";
    },
    getChordAt(tableIndex, colIndex) {
      const table = this.tables[tableIndex];
      if (table && colIndex < table.length) {
        return table[colIndex];
      }
      return "";
    },

    addSelections() {
      const pipeCount = this.selectedChords.filter(
        (chord) => chord === "|"
      ).length;

      if (this.selectedChords.length === 0) {
        Toast.customError("코드를 먼저 등록해주세요.");
      } else if (this.selectedChords[this.selectedChords.length - 1] === "|") {
        Toast.customError("마디를 추가한 이후에는 코드를 등록해주세요.");
      } else if (pipeCount > this.selectedMeasure - 2) {
        Toast.customError("선택한 마디보다 많이 추가할 수 없습니다.");
      } else {
        this.selectedChords.push("|");
      }
    },
    // removeSelections() {
    //   if (this.selectedChords.length === 0) {
    //     Toast.customError("코드를 먼저 등록해주세요.");
    //   } else this.selectedChords.pop();
    // },
    // resetSelections() {
    //   if (this.selectedChords.length === 0) {
    //     Toast.customError("코드를 먼저 등록해주세요.");
    //   } else this.selectedChords = [];
    // },
    // removeSelections() {
    //   if (this.tables[0] === undefined || this.tables[0] === null) {
    //     Toast.customError("테이블이 생성되지 않았습니다.");
    //     return;
    //   }

    //   if (this.tables[0].length === 0) {
    //     Toast.customError("테이블이 비어있습니다.");
    //     return;
    //   }

    //   this.tables[0].pop();
    // },
    removeSelections() {
      if (!this.tables[0]) {
        Toast.customError("코드를 먼저 등록해주세요.");
        return;
      }

      let removed = false;

      // 가장 마지막 테이블부터 역순으로 검사하여 코드 지우기 시도
      for (let i = this.tables.length - 1; i >= 0; i--) {
        if (this.tables[i].length > 0) {
          this.tables[i].pop();
          removed = true;
          break;
        }
      }

      if (!removed) {
        Toast.customError("악보에 코드가 없습니다.");
      }
    },

    resetSelections() {
      if (!this.tables[0]) {
        Toast.customError("악보에 초기화할 코드가 없습니다.");
      }

      this.tables = [];
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
/* #app {
  overflow: hidden;
} */

.backtrack-generator {
  width: 100%;
  height: 100%;
  padding: 20px 0px;
  border: 1px solid #ccc;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-left: -20px;
  /*  */
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  /*  */
}

.backtrack-generator form {
  display: flex;
  flex-direction: column;
  width: 6000px;
  height: 10000px;
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
  /* background: linear-gradient(to top, #00b869, #03c75a); */
}

.backtrack-generator button:hover {
  background-color: #00b869;
}

.backtrack-generator ul {
  margin-top: 20px;
  list-style: none;
  padding: 0;
}

.backtrack-generator li {
  margin-bottom: 6px;
}
.bpm-selector-toggle {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.input-group1 {
  background-color: #f0f0f0;
  padding: 20px 100px;
  border: 1px solid #ccc;
  margin-left: 45px;
  font-size: 80px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 1650px;
}

.input-group2 {
  background-color: #f0f0f0;
  padding: 20px;
  border: 1px solid #ccc;
  margin-top: 55px;
  margin-left: 30px;
  font-size: 75px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  align-items: flex-start;
  width: 1650px;
}
.input-group3 {
  background-color: #f0f0f0;
  padding: 50px;
  border: 1px solid #ccc;
  margin-top: 30px;
  margin-left: -250px;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 122%;
}
.input-group4 {
  background-color: #f0f0f0;
  padding: 20px;
  border: 1px solid #ccc;
  margin: 10px;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.preview-container,
.fix-container {
  font-size: 75px;
  display: flex;
  flex-direction: row;
}
.preview-container {
  justify-content: space-between;
}

.input-group1-label {
  display: flex;
}
.measure-label-container,
.ext-label-container,
.key-label-container,
.bpm-label-container {
  display: flex;
  align-items: center;

  padding: 0px 40px;
}
.ext-label-container,
.key-label-container {
  justify-content: center;
}
.toggle-container1,
.measure-input-container,
.bpm-input-container {
  display: flex;
  align-items: center;
}

.measure-input,
.bpm-input {
  margin-top: 5px;
  width: 500px;
}
.bpm-container {
  margin-top: 30px;
}
.measure-container {
  margin-right: 23px;
}
.measure-label,
.ext-label,
.key-label,
.bpm-label {
  font-size: 70px;
}

.ext-selector,
.key-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ext-grid,
.key-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

.ext-button,
.key-button {
  color: #fff;
  border: 1px solid #ccc;
  padding: 5px 10px;
  margin-right: 20px;
  border-radius: 4px;
  width: 200px;
  cursor: pointer;
  background: linear-gradient(to top, #00b869, #03c75a);
}
.ext-button.selected,
.key-button.selected {
  background-color: #084dbf;
}

.key-button:hover {
  background: #60a687;
}

.register-button {
  background-color: #f2c72d !important;
  width: 200px;
}
.register-button:hover {
  background-color: #dcb837 !important;
}
.reset-button {
  margin-right: 10px;
  font-size: 80px;
  width: 500px;
  flex-wrap: wrap;
  background: linear-gradient(to top, #00b869, #03c75a);
}
.generate-button {
  margin-right: 20px;
  font-size: 80px;
  width: 1000px;
  flex-wrap: wrap;
  background: linear-gradient(to top, #00b869, #03c75a);
}
.welcome-message {
  display: flex;
  margin-top: 15px;
  margin-right: 25px;
  align-items: center;
}

.menu-container {
  position: fixed;
  display: inline-block;
  /* z-index: 1; */
}
.dropdown-toggle1 {
  width: 440px;
  font-size: 80px;
  background: linear-gradient(to top, #00b869, #03c75a);
}

.dropdown-menu1,
.dropdown-menu2 {
  position: absolute;
  top: 55px;
  width: 440px;
  left: 750px;
  background-color: white;
  border: 1px solid #ccc;
  list-style-type: none;
  display: block;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
}

.dropdown-menu2 ul,
.dropdown-menu1 ul {
  padding: 8px;
  cursor: pointer;
}

.dropdown-menu2 li,
.dropdown-menu1 li {
  padding: 0 25px;
}
.dropdown-menu2 li:hover,
.dropdown-menu1 li:hover {
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
.chord-container {
  display: flex;
  justify-content: space-between;
  flex-direction: column !important;
  align-items: center;
}
.chord-list {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  overflow: hidden;
  margin-top: 80px;
}
.chord-list2 {
  display: flex;
  flex-wrap: wrap;
  font-size: 100px;
  padding: 0px 10px;
}

.chords {
  padding: 0px 50px;
}
.table-container {
  /* width: 100%; */
  margin-bottom: 100px;
  /* overflow: auto;  */
}

.chord-table {
  width: 3500px;
  margin-top: 100px;
  /* border-collapse: collapse;  */
}
.chord-cell {
  width: 25%;
  height: 0;

  font-size: 90px;
  text-align: center;
  position: relative;

  border: 1px solid #000;

  border-top: none;
  border-bottom: none;
}
.chord-cell::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 30px;

  border-top: none;
  border-bottom: 2px solid #000;
}
.chord-content {
  position: absolute;
  height: 110%;
  padding: 20px;
  transform: translateY(-50%);
}
</style>
