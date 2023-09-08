<template>
  <v-dialog
    v-model="$store.state.showBacktrackSuccessModal"
    persistent=""
    @opened="playBacktrack"
  >
    <div class="backtrack-success-modal">
      <h2 style="font-size: 3em; margin-top: 100px">
        <div v-if="isLogged">
          {{ $store.state.loggedInNickname }} 님의 백킹트랙
        </div>
      </h2>

      <div style="font-size: 3em; margin-top: 100px">
        백킹트랙이 생성되었습니다. <br />만들어진 백킹트랙을 재생 및 저장할 수
        있습니다.
      </div>

      <div class="sheet-music">
        <div v-if="previousChordArray">
          <div class="previous-measure">
            <span
              v-for="(chordSegment, segmentIndex) in previousChordArray"
              :key="segmentIndex"
              :class="getChordInPreviousMeasure(chordSegment)"
            >
              {{ chordSegment }}
            </span>
          </div>
        </div>

        <div class="measure">
          <span
            v-for="(chordSegment, segmentIndex) in currentChordArray"
            :key="segmentIndex"
            :class="getChordInMeasure(chordSegment)"
          >
            {{ chordSegment }}
          </span>
        </div>
        <!-- 다음 코드 배열을 작게 표시합니다 -->
        <div v-if="nextChordArray">
          <div class="next-measure">
            <span
              v-for="(chordSegment, segmentIndex) in nextChordArray"
              :key="segmentIndex"
              :class="getChordInNextMeasure(chordSegment)"
            >
              {{ chordSegment }}
            </span>
          </div>
        </div>
      </div>
      <v-card width="1500">
        <v-toolbar @click="toggleCard" style="height: 150px; cursor: pointer">
          <v-btn>
            <span class="metronome-title">METRONOME</span>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-row
            :style="{ height: cardOpen ? '300px' : '0px' }"
            class="mb-4"
            justify="space-between"
          >
            <v-col class="text-left">
              <span class="bpm font-weight-light" v-text="bpm"></span>
              <span class="bpm font-weight-light me-1">BPM</span>
              <v-fade-transition>
                <v-avatar
                  v-if="isPlaying"
                  :color="color"
                  :style="{
                    animationDuration: animationDuration,
                  }"
                  class="mb-1 v-avatar--metronome"
                  size="12"
                ></v-avatar>
              </v-fade-transition>
            </v-col>
            <v-col v-show="cardOpen" class="text-right">
              <v-btn
                :color="color"
                theme="dark"
                icon
                elevation="0"
                size="x-large"
              >
                <v-icon
                  id="metronomeButton"
                  size="x-large"
                  @click="toggle"
                  :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"
                ></v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-slider
            v-show="cardOpen"
            v-model="bpm"
            :color="color"
            track-color="grey"
            min="40"
            max="218"
            :step="1"
            @change="updateBpm"
          >
            <template v-slot:prepend>
              <v-btn
                size="small"
                variant="text"
                icon="mdi-minus"
                :color="color"
                @click="decrement"
              ></v-btn>
            </template>

            <template v-slot:append>
              <v-btn
                size="small"
                variant="text"
                icon="mdi-plus"
                :color="color"
                @click="increment"
              ></v-btn>
            </template>
          </v-slider>
        </v-card-text>
      </v-card>
      <div class="button-container">
        <v-btn
          id="playButton"
          @click="playAudio"
          class="me-5 text-none"
          color="#4f545c"
          variant="flat"
          size="x-large"
        >
          음원 재생
        </v-btn>
        <v-btn id="stopButton" border class="text-none" variant="text">
          음원 정지
        </v-btn>
        <v-btn
          id="closeButton"
          type="button"
          @click="closeAllModals"
          border
          class="text-none"
          variant="text"
        >
          닫기
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
// import axios from "axios";
import * as Tone from "tone";
export default {
  data() {
    return {
      abcContent: "",
      audioElements: [],

      isDrum: null,
      isUp: null,
      metronomeSequence: null,
      drum: null,
      transport: Tone.Transport,

      tableIndex: 0,
      measureIndex: 0,
      chordIndex: 0,
      previousChordArray: null,
      currentChordArray: [],
      nextChordArray: [],
      bpm: this.$store.state.bpm,
      isPlaying: false,
      cardOpen: false,
      upSoundUrl: "midi/metronome/up.wav",
      downSoundUrl: "midi/metronome/down.wav",
      drumSoundUrl: "midi/Drummer.wav",
    };
  },
  computed: {
    isLogged() {
      return !!this.$store.state.loggedInNickname;
    },
    // bpm() {
    //   return this.bpm;
    // },
    color() {
      if (this.bpm < 100) return "indigo";
      if (this.bpm < 125) return "teal";
      if (this.bpm < 140) return "green";
      if (this.bpm < 175) return "orange";
      return "red";
    },
    animationDuration() {
      return `${60 / this.bpm}s`;
    },
  },
  created() {
    Tone.Transport.loop = false;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = "4m";
  },
  // mounted() {

  // },
  methods: {
    decrement() {
      this.bpm--;
    },
    increment() {
      this.bpm++;
    },
    toggle() {
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) {
        this.startMetronome();
      } else {
        this.stopMetronome();
      }
    },
    closeAllModals() {
      this.$store.commit("toggleBacktrackSuccessModal", false);
    },
    toggleCard() {
      this.cardOpen = !this.cardOpen;
    },

    updatePreviousChordArray(newChordArray) {
      // this.previousChordArray = this.currentChordArray;
      this.previousChordArray = newChordArray;
    },

    updateCurrentChordArray(newChordArray) {
      this.currentChordArray = newChordArray;
    },

    updateNextChordArray(newChordArray) {
      this.nextChordArray = newChordArray;
    },
    updateBpm() {
      Tone.Transport.bpm.value = this.bpm;
      this.stopMetronome();
      this.startMetronome();
    },
    stopMetronome() {
      if (this.metronomeSequence) {
        this.metronomeSequence.clear();
        this.transport.stop();
      }
    },
    startMetronome() {
      Tone.start();

      // const tempo = this.$store.state.bpm;
      Tone.Transport.bpm.value = this.bpm;
      this.metronomeSequence = new Tone.Sequence(
        (time, note) => {
          // "up" 또는 "down" 사운드 재생
          if (note === "up" && !this.isUp) {
            const upSound = new Tone.Player({
              url: this.upSoundUrl,
              autostart: true,
            }).toDestination();
            this.isUp = true;
          } else if (note === "down") {
            const downSound = new Tone.Player({
              url: this.downSoundUrl,
              autostart: true,
            }).toDestination();
            this.isUp = false;
          }
        },
        ["up", "down", "down", "down"],
        "4n"
      );

      this.metronomeSequence.start(0.09);
      this.transport.start();
    },

    /** 재생 */
    playAudio() {
      const self = this;
      Tone.start();

      const tempo = this.$store.state.bpm;
      Tone.Transport.bpm.value = tempo;

      const bassUrls = {
        Cb: "midi/bass/B.wav",
        C: "midi/bass/C.wav",
        Csharp: "midi/bass/Db.wav",
        Db: "midi/bass/Db.wav",
        D: "midi/bass/D.wav",
        Dsharp: "midi/bass/Eb.wav",
        Eb: "midi/bass/Eb.wav",
        E: "midi/bass/E.wav",
        Esharp: "midi/bass/F.wav",
        Fb: "midi/bass/E.wav",
        F: "midi/bass/F.wav",
        Fsharp: "midi/bass/Gb.wav",
        Gb: "midi/bass/Gb.wav",
        G: "midi/bass/G.wav",
        Gsharp: "midi/bass/Ab.wav",
        Ab: "midi/bass/Ab.wav",
        A: "midi/bass/A.wav",
        Asharp: "midi/bass/Bb.wav",
        Bb: "midi/bass/Bb.wav",
        B: "midi/bass/B.wav",
        Bsharp: "midi/bass/C.wav",
      };
      const backtrackData = this.$store.state.chordData;

      let tableIndex = this.tableIndex;
      let measureIndex = this.measureIndex;
      let chordIndex = this.chordIndex;

      function playNextSound() {
        if (tableIndex < backtrackData.length) {
          const currentRow = backtrackData[tableIndex];
          if (measureIndex < currentRow.length) {
            const currentCol = currentRow[measureIndex];
            if (chordIndex < currentCol.length) {
              const sound = currentCol[chordIndex];
              const soundArray = currentCol;

              console.log("현재 배열: ", soundArray);

              playSoundsSequentially(soundArray);

              chordIndex++;
            } else {
              // 하위 배열이 모두 재생되면 다음 열로 이동
              chordIndex = 0;
              self.measureIndex++;
            }
          } else {
            // 현재 행이 모두 재생되면 다음 행으로 이동
            measureIndex = 0;
            self.tableIndex++;
          }
        } else {
          // 모든 음원 재생이 완료되면 종료
          console.log("모든 음원 재생 완료");
        }
      }

      async function playSoundsSequentially(input, index = 0) {
        let soundArray;

        if (Array.isArray(input)) {
          soundArray = input;
        } else {
          console.error("잘못된 입력 형식입니다.", input);
          return;
        }

        if (index < soundArray.length) {
          console.log("코드 바뀌는곳");

          if (measureIndex !== 0) {
            self.updatePreviousChordArray(
              backtrackData[tableIndex][measureIndex - 1]
            );
          }
          self.updateCurrentChordArray(backtrackData[tableIndex][measureIndex]);

          if (measureIndex === 3 && soundArray.length === 4) {
            if (backtrackData[tableIndex + 1] !== undefined) {
              self.updateNextChordArray(backtrackData[tableIndex + 1][0]);
            } else if (backtrackData[tableIndex + 1] === undefined) {
              self.updateNextChordArray([]);
            }
          } else {
            self.updateNextChordArray(
              backtrackData[tableIndex][measureIndex + 1]
            );
          }

          let chord = soundArray[index];
          if (chord.endsWith("#")) {
            chord = chord.replace("#", "sharp");
          }

          const bassUrl = bassUrls[chord];
          if (bassUrl) {
            playSound(bassUrl);

            // 다음 음원을 BPM에 따른 간격으로 재생
            Tone.Transport.scheduleOnce(() => {
              playSoundsSequentially(soundArray, index + 1);
            }, `+${60 / tempo}`);
          } else {
            console.error(`음원 ${chord}의 URL을 찾을 수 없습니다.`);
          }
        } else {
          if (measureIndex < backtrackData[tableIndex].length - 1) {
            self.updateCurrentChordArray(
              backtrackData[tableIndex][measureIndex]
            );
            measureIndex++;
            console.log("마디 바뀌는곳");
            // self.updatePreviousChordArray();
            self.updateNextChordArray(backtrackData[tableIndex][measureIndex]);
            playSoundsSequentially(backtrackData[tableIndex][measureIndex]);
          } else if (tableIndex < backtrackData.length - 1) {
            chordIndex = 0;
            measureIndex = 0;
            tableIndex++;
            self.updateNextChordArray(backtrackData[tableIndex][measureIndex]);
            self.updateCurrentChordArray(
              backtrackData[tableIndex][measureIndex]
            );
            console.log("테이블 바뀌는곳");
            self.updatePreviousChordArray(backtrackData[tableIndex - 1][3]);

            playSoundsSequentially(backtrackData[tableIndex][measureIndex]);
          } else {
            // 모든 음원 재생이 완료되면 종료
            stopSounds();
            console.log("모든 음원 재생 완료");
          }
        }
      }

      let prevSound;
      let currentSounds = [];
      function stopSounds() {
        // 현재 재생 중인 모든 음원을 중지
        currentSounds.forEach((sound) => {
          sound.stop();
        });
        currentSounds = [];
      }
      function playSound(soundUrl) {
        console.log("현재 재생된 url: ", soundUrl);

        stopSounds();

        const sound = new Tone.Player({
          url: soundUrl,
          autostart: true,
        }).toDestination();

        currentSounds.forEach((sound) => {
          sound.stop();
        });

        prevSound = sound;
        currentSounds.push(sound);
      }

      const drum = new Tone.Player({
        url: this.drumSoundUrl,
        autostart: true,
      }).toDestination();

      const metronome = new Tone.Sequence(
        (time, note) => {
          // "up" 또는 "down" 사운드 재생
          if (note === "up" && !this.isUp) {
            const upSound = new Tone.Player({
              url: this.upSoundUrl,
              autostart: true,
            }).toDestination();
            this.isUp = true;
          } else if (note === "down") {
            const downSound = new Tone.Player({
              url: this.downSoundUrl,
              autostart: true,
            }).toDestination();
            this.isUp = false;
          }
        },
        ["up", "down", "down", "down"],
        "4n"
      );

      metronome.start(0.09);
      playNextSound();
      document.getElementById("playButton").addEventListener("click", () => {
        Tone.Transport.start();
      });

      // 정지 버튼 클릭 이벤트 처리
      document.getElementById("stopButton").addEventListener("click", () => {
        stopSounds();
        drum.stop();
        metronome.clear();

        this.isDrum = false;
        this.transport.stop();
      });
      document.getElementById("closeButton").addEventListener("click", () => {
        drum.stop();
        metronome.clear();
        this.isDrum = false;
        this.transport.stop();
      });
      // 메트로놈 시작
      this.transport.start();
    },

    getChordInMeasure(chordSegment) {
      const classes = [];

      if (
        [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "A#",
          "B#",
          "C#",
          "D#",
          "E#",
          "F#",
          "G#",
          "Ab",
          "Bb",
          "Cb",
          "Db",
          "Eb",
          "Fb",
          "Gb",
        ].includes(chordSegment)
      ) {
        classes.push("key-font");
      } else if (chordSegment === "-") {
        classes.push("blank-font");
      } else {
        classes.push("extends-font");
      }

      return classes;
    },
    getChordInPreviousMeasure(chordSegment) {
      const classes = [];

      if (
        [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "A#",
          "B#",
          "C#",
          "D#",
          "E#",
          "F#",
          "G#",
          "Ab",
          "Bb",
          "Cb",
          "Db",
          "Eb",
          "Fb",
          "Gb",
        ].includes(chordSegment)
      ) {
        classes.push("small-key-font");
      } else if (chordSegment === "-") {
        classes.push("blank-font");
      } else {
        classes.push("extends-font");
      }

      return classes;
    },
    getChordInNextMeasure(chordSegment) {
      const classes = [];

      if (
        [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "A#",
          "B#",
          "C#",
          "D#",
          "E#",
          "F#",
          "G#",
          "Ab",
          "Bb",
          "Cb",
          "Db",
          "Eb",
          "Fb",
          "Gb",
        ].includes(chordSegment)
      ) {
        classes.push("small-key-font");
      } else if (chordSegment === "-") {
        classes.push("blank-font");
      } else {
        classes.push("extends-font");
      }

      return classes;
    },
  },
};
</script>

<style scoped>
.backtrack-success-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid lightgray;
  padding: 4rem 4rem;
  border-radius: 5px;
  background: #fefefe;
  width: 3000px;
  height: 2200px;
  text-align: center;
}

.previous-measure,
.measure,
.next-measure {
  position: absolute;
  left: 50%; /* 가운데 정렬을 위해 왼쪽 위치를 50%로 설정 */
  transform: translateX(
    -50%
  ); /* 가운데 정렬을 위해 자신의 너비의 반만큼 왼쪽으로 이동 */
}

.previous-measure {
  top: 320px;
  color: rgb(165, 165, 165);
}

.measure {
  top: 40%;
  transform: translate(-50%, -50%);
}

.next-measure {
  bottom: 820px;
  color: rgb(165, 165, 165);
}

.sheet-music {
  width: 100%;
  height: 1000px;
  background-color: #f0f0f0;
  margin-top: 50px;
  padding: 20px;
  font-size: 200px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

#stopButton,
#closeButton,
#playButton {
  position: fixed;
  right: 60px;
  bottom: 640px;
  width: 450px;
  height: 150px;
  font-size: 4em;
}
#playButton {
  right: 940px;
}
#stopButton {
  right: 510px;
}

.button-container {
  margin-bottom: 100px;
}

.abc-container {
  width: 100%;
  height: 100%;
  font-size: 80px;
  /* transform: scale(3); */
}

@font-face {
  font-family: "Font1";
  src: url("../../assets/fonts/realbook.ttf");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "Font2";
  src: url("../../assets/fonts/PetalumaScript.woff");
  font-weight: normal;
  font-style: normal;
}

.key-font {
  font-family: "Font1";
  font-size: 300px;
  padding: 0px 100px;
}
.small-key-font {
  font-family: "Font1";
  font-size: 150px;
  padding: 0px 100px;
}

.extends-font {
  position: relative;
  font-family: "Font2";
  font-size: 70px;
  bottom: 100px;
}
.blank-font {
  font-family: "Font2";
  font-size: 50px;
  margin-left: 50px;
}

@keyframes metronome-example {
  from {
    transform: scale(0.5);
  }

  to {
    transform: scale(1);
  }
}

.v-avatar--metronome {
  animation-name: metronome-example;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
::v-deep .v-card {
  margin-top: 50px;
}
::v-deep .v-card .v-card-text {
  line-height: 300px;
}
::v-deep .v-toolbar-title__placeholder {
  height: 100px;
  font-size: 200px;
  align-items: center;
}
::v-deep .v-btn--icon.v-btn--density-default {
  width: 100px;
  height: 100px;
  font-size: 50px;
}

/* ::v-deep .v-toolbar:hover {
  background-color: #cfcdcd;
}  */
.bpm {
  font-size: 200px;
  margin-left: 30px;
}
.metronome-title {
  position: relative;
  font-size: 70px;
  padding: 50px 50px;
  text-align: left;

  /* height: 200px; */
}
</style>
