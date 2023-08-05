<template>
  <div class="backtrack-generator">
    <form @submit.prevent>
      <div class="key-selector">
        <label class="key-label">KEY:</label>
        <div class="key-grid">
          <button
            class="key-button"
            v-for="key in keyOptions.slice(0, 3)"
            :key="key"
            @click="selectKey(key)"
            :class="{ selected: selectedKey === key }"
          >
            {{ key }}
          </button>
          <button
            class="key-button"
            v-for="key in keyOptions.slice(3, 6)"
            :key="key"
            @click="selectKey(key)"
            :class="{ selected: selectedKey === key }"
          >
            {{ key }}
          </button>
          <button
            class="key-button"
            v-for="key in keyOptions.slice(6)"
            :key="key"
            @click="selectKey(key)"
            :class="{ selected: selectedKey === key }"
          >
            {{ key }}
          </button>
          <button
            class="key-button"
            v-for="modifier in ['b', '#']"
            :key="modifier"
            @click="appendModifier(modifier)"
            :class="{ selected: selectedModifier === modifier }"
          >
            {{ modifier }}
          </button>
        </div>
      </div>
      <!-- <label>
        Beats Per Measure:
        <input
          class="input-field"
          v-model.number="beatsPerMeasure"
          type="number"
        />
      </label> -->
      <!-- <label>
        Style:
        <input class="input-field" v-model="style" />
      </label> -->
      <label>
        BPM:
        <input class="input-field" v-model.number="bpm" type="number" />
      </label>
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
      selectedKey: "",
      selectedModifier: "",
      // beatsPerMeasure: 4,
      // style: "pop",
      bpm: 120,
      backtrack: null,
      toastMessage: "",
      toastColor: "",
    };
  },
  methods: {
    selectKey(key) {
      if (this.selectedKey !== key) {
        this.selectedKey = key;
        this.selectedModifier = "";
      }
    },
    appendModifier(modifier) {
      if (this.selectedKey) {
        this.selectedModifier = modifier;
      }
    },
    async generateBacktrack() {
      // e.preventDefault();
      try {
        const keyWithModifier = this.selectedKey + this.selectedModifier;
        const response = await axios.post("http://localhost:4000/api/jam", {
          key: keyWithModifier,
          // beatsPerMeasure: this.beatsPerMeasure,
          // style: this.style,
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
.key-selector {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 왼쪽 정렬 */
}
.key-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

.label-and-buttons {
  display: flex;
  align-items: center; /* 수직 정렬 */
  margin-bottom: 10px;
}

.key-label {
  margin-right: 10px;
}

.key-buttons,
.modifier-buttons {
  display: flex;
}
.key-button {
  background-color: #0c63e4;
  color: #fff;
  border: none;
  padding: 5px 10px;
  margin-right: 5px;
  border-radius: 4px;
  cursor: pointer;
}

.key-button.selected {
  background-color: #084dbf;
}

.key-button:hover {
  background-color: #084dbf;
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
