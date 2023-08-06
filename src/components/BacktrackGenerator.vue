<template>
  <div class="backtrack-generator">
    <form @submit.prevent>
      <div class="input-group">
        <div class="bpm-label-container">
          <label class="bpm-label">BPM:</label>
        </div>
        <div class="bpm-input">
          <input class="input-field" v-model.number="bpm" type="number" />
        </div>
      </div>
      <div class="input-group">
        <div class="key-label-container">
          <label class="key-label">KEY:</label>
        </div>
        <div class="key-selector">
          <div class="key-grid">
            <button
              class="key-button"
              v-for="key in keyOptions.slice(0, 3)"
              :key="key"
              @click="toggleButton('selectedKey', key)"
              :class="{ selected: selectedKey === key }"
            >
              {{ key }}
            </button>
            <button
              class="key-button"
              v-for="key in keyOptions.slice(3, 6)"
              :key="key"
              @click="toggleButton('selectedKey', key)"
              :class="{ selected: selectedKey === key }"
            >
              {{ key }}
            </button>
            <button
              class="key-button"
              v-for="key in keyOptions.slice(6)"
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
      </div>
      <div class="input-group">
        <div class="ext-label-container">
          <label class="ext-label">Extends:</label>
        </div>
        <div class="ext-selector">
          <div class="ext-grid">
            <button
              class="ext-button"
              v-for="extend in extendOptions.slice(0, 3)"
              :key="extend"
              @click="toggleButton('selectedExtend', extend)"
              :class="{ selected: selectedExtend === extend }"
            >
              {{ extend }}
            </button>
            <button
              class="ext-button"
              v-for="extend in extendOptions.slice(3, 6)"
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
      <div class="input-group">
        <button class="register-button" @click="registerBacktrack">등록</button>
        <button class="reset-button" @click="resetSelections">초기화</button>
      </div>
      <div class="result">
        <label class="key-label">선택한 코드:</label>
        <div class="code-list">
          <span class="code" v-for="code in selectedCodes" :key="code">
            {{ code }}
          </span>
        </div>
      </div>

      <button class="generate-button" type="button" @click="generateBacktrack">
        Generate Backtrack
      </button>
    </form>

    <div v-if="backtrack" class="generated-backtrack">
      <h2>Generated Backtrack:</h2>
      <ul>
        <li v-for="note in backtrack" :key="note.pitch">
          {{ note.pitch }} - {{ note.duration }}s
        </li>
      </ul>
    </div>

    <Toast :message="toastMessage" :color="toastColor" :timeout="3000" />
  </div>
</template>

<script>
import axios from "axios";
import Toast from "./Toast.vue";

export default {
  components: {
    Toast,
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
      selectedCodes: [],
      // beatsPerMeasure: 4,
      // style: "pop",
      bpm: 120,
      backtrack: null,
      toastMessage: "",
      toastColor: "",
    };
  },
  methods: {
    toggleButton(prop, value) {
      if (this[prop] === value) {
        this[prop] = "";
      } else {
        this[prop] = value;
      }
    },

    registerBacktrack() {
      const code =
        this.selectedKey +
        this.selectedModifier_fs +
        this.selectedExtend +
        this.selectedModifier_67 +
        this.selectedModifier_b5 +
        this.selectedModifier_tension;
      this.selectedCodes.push(code);
      return code;
    },
    resetSelections() {
      this.selectedKey = "";
      this.selectedExtend = "";
      this.selectedCodes = [];
    },
    // selectKey(key) {
    //   if (this.selectedKey !== key) {
    //     this.selectedKey = key;
    //     this.selectedModifier_fs = "";
    //   }
    // },
    // selectExtend(extend) {
    //   if (this.selectedExtend) {
    //     this.selectedExtend = extend;
    //   }
    // },
    // appendModifier_fs(modifier_fs) {
    //   if (this.selectedKey) {
    //     this.selectedModifier_fs = modifier_fs;
    //   }
    // },
    // appendModifier_67(modifier_67) {
    //   if (this.selectedKey) {
    //     this.selectedModifier_67 = modifier_67;
    //   }
    // },
    // appendModifier_b5(modifier_b5) {
    //   if (this.selectedKey) {
    //     this.selectedModifier_b5 = modifier_b5;
    //   }
    // },
    async generateBacktrack() {
      // e.preventDefault();
      try {
        // const chord =
        //   this.selectedKey +
        //   this.selectedModifier_fs +
        //   this.selectedExtend +
        //   this.selectedModifier_67;
        const result = this.registerBacktrack();
        const response = await axios.post("http://localhost:4000/api/jam", {
          key: result,
          bpm: this.bpm,
        });

        this.backtrack = response.data.backtrack;
      } catch (error) {
        console.error("Error generating backtrack:", error);
        this.showToast("Error generating back", "error");
      }
    },
    showToast(message, color) {
      this.toastMessage = message;
      this.toastColor = color;
    },
  },
};
</script>

<style scoped>
.input-group {
  display: flex;
  align-items: center;
}

.input-group-label {
  display: flex;
  /* flex-direction: column; */
  /* margin-right: 20px; */
}
.ext-label-container,
.key-label-container,
.bpm-label-container {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.ext-label,
.key-label,
.bpm-label {
  margin-right: 5px;
}

.key-selector {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 왼쪽 정렬 */
}
.ext-grid,
.key-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

.ext-button,
.key-button {
  background-color: #0c63e4;
  color: #fff;
  border: none;
  padding: 5px 10px;
  margin-right: 5px;
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

.register-button,
.reset-button {
  /* Add your button styles */
  margin-right: 10px;
}

.result {
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
}
.code-list {
  display: flex;
  flex-wrap: wrap;
}

.code {
  /* Add your styling for code items */
  margin-right: 10px;
  margin-bottom: 10px;
}

.backtrack-generator {
  max-width: 400px;
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
  background-color: #0c63e4;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
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

/* Toast 컴포넌트 스타일 추가 */
.toast-message {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
