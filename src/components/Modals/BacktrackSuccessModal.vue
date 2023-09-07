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
      <!-- <div class="sheet-music">
        <div id="abc-container" class="abc-container">
          <div v-for="measureChords in $store.state.chordData">
            <div class="measure">
              <div
                class="chord-segment"
                v-for="chords in measureChords"
                :key="chords.join('-')"
              >
                <span
                  class="chord-segment-item"
                  v-for="chordSegment in chords"
                  :key="chordSegment"
                  style="padding: 0 30px"
                >
                  <span
                    v-for="piece in chordSegment.split(' ')"
                    :key="piece"
                    :class="['chord-piece', getChordInMeasure(piece)]"
                  >
                    {{ piece }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <div class="sheet-music">
        <div v-if="previousChordArray">
          <div class="previous-measure">
            <span
              v-for="(chordSegment, segmentIndex) in previousChordArray"
              :key="segmentIndex"
              :class="getChordInSmallMeasure(chordSegment)"
            >
              {{ chordSegment }}
            </span>
          </div>
        </div>
        <div id="abc-container" class="abc-container">
          <div class="measure">
            <!-- chordSegment를 순회하면서 현재와 다음 코드 배열을 표시합니다 -->
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
                :class="getChordInSmallMeasure(chordSegment)"
              >
                {{ chordSegment }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        id="playButton"
        @click="playAudio"
        class="btn-play"
        style="font-size: 3.5em"
      >
        음원 재생
      </button>
      <button
        id="stopButton"
        @click="stopAllAudio"
        class="btn-stop"
        style="font-size: 3.5em"
      >
        음원 정지
      </button>
      <button
        id="closeButton"
        type="button"
        @click="closeAllModals"
        class="btn-success"
        style="font-size: 3.5em"
      >
        닫기
      </button>
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
      metronomeInterval: null,
      isDrum: null,
      isUp: null,
      metronome: null,
      drum: null,
      transport: Tone.Transport,

      rowIndex: 0,
      colIndex: 0,
      subColIndex: 0,
      previousChordArray: null,
      currentChordArray: [],
      nextChordArray: [],
    };
  },
  computed: {
    isLogged() {
      return !!this.$store.state.loggedInNickname;
    },
    bpm() {
      return this.$store.state.bpm;
    },
    // currentChordArray() {
    //   if (
    //     this.rowIndex >= 0 &&
    //     this.rowIndex < this.$store.state.chordData.length &&
    //     this.colIndex >= 0 &&
    //     this.colIndex < this.$store.state.chordData[this.rowIndex].length
    //   ) {
    //     return this.$store.state.chordData[this.rowIndex][this.colIndex];
    //   } else {
    //     return [];
    //   }
    // },
    // nextChordArray() {
    //   if (
    //     this.rowIndex + 1 >= 0 &&
    //     this.rowIndex + 1 < this.$store.state.chordData.length &&
    //     this.colIndex >= 0 &&
    //     this.colIndex < this.$store.state.chordData[this.rowIndex + 1].length
    //   ) {
    //     return this.$store.state.chordData[this.rowIndex + 1][this.colIndex];
    //   } else {
    //     return [];
    //   }
    // },
  },
  created() {
    Tone.Transport.loop = false;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = "4m";
  },
  // mounted() {

  // },
  methods: {
    closeAllModals() {
      this.$store.commit("toggleBacktrackSuccessModal", false);
    },

    updatePreviousChordArray() {
      this.previousChordArray = this.currentChordArray;
    },

    updateCurrentChordArray(newChordArray) {
      this.currentChordArray = newChordArray;
    },

    updateNextChordArray(newChordArray) {
      this.nextChordArray = newChordArray;
    },

    /** 재생 */
    playAudio() {
      const self = this;
      Tone.start();

      const tempo = this.$store.state.bpm;
      Tone.Transport.bpm.value = tempo;

      // .wav
      const upSoundUrl = "midi/metronome/up.wav";
      const downSoundUrl = "midi/metronome/down.wav";
      const drumSoundUrl = "midi/Drummer.wav";
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

      let rowIndex = this.rowIndex;
      let colIndex = this.colIndex;
      let subColIndex = this.subColIndex;

      function playNextSound() {
        if (rowIndex < backtrackData.length) {
          const currentRow = backtrackData[rowIndex];
          if (colIndex < currentRow.length) {
            const currentCol = currentRow[colIndex];
            if (subColIndex < currentCol.length) {
              const sound = currentCol[subColIndex];
              const soundArray = currentCol;

              console.log("현재 배열: ", soundArray);

              playSoundsSequentially(soundArray);

              subColIndex++;
            } else {
              // 하위 배열이 모두 재생되면 다음 열로 이동
              subColIndex = 0;
              self.colIndex++;
              self.updateNextChordArray([]);
              self.updatePreviousChordArray();
            }
          } else {
            // 현재 행이 모두 재생되면 다음 행으로 이동
            colIndex = 0;
            this.rowIndex++;
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
          console.error("잘못된 입력 형식입니다.");
          return;
        }
        //1마디만 생성하는 경우
        if (index < soundArray.length) {
          self.updateCurrentChordArray(backtrackData[rowIndex][colIndex]);
          self.updateNextChordArray(backtrackData[rowIndex][colIndex + 1]);

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
          if (colIndex < backtrackData[rowIndex].length - 1) {
            self.updateCurrentChordArray(backtrackData[rowIndex][colIndex]);
            subColIndex = 0;
            colIndex++;
            self.updatePreviousChordArray();

            playSoundsSequentially(backtrackData[rowIndex][colIndex]);
          } else if (rowIndex < backtrackData.length - 1) {
            subColIndex = 0;
            colIndex = 0;
            rowIndex++;
            self.updateCurrentChordArray(backtrackData[rowIndex][colIndex]);
            self.updatePreviousChordArray();

            playSoundsSequentially(backtrackData[rowIndex][colIndex]);
          } else {
            // 모든 음원 재생이 완료되면 종료
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
        url: drumSoundUrl,
        autostart: true,
        console: console.log("drum: ", drumSoundUrl),
      }).toDestination();

      const metronome = new Tone.Sequence(
        (time, note) => {
          // "up" 또는 "down" 사운드 재생
          if (note === "up" && !this.isUp) {
            const upSound = new Tone.Player({
              url: upSoundUrl,
              autostart: true,
            }).toDestination();
            this.isUp = true;
          } else if (note === "down") {
            const downSound = new Tone.Player({
              url: downSoundUrl,
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

    async sheetMusic() {
      try {
      } catch (error) {
        console.error("Error to create Backtrack in:", error);
      }
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
    getChordInSmallMeasure(chordSegment) {
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
  min-height: 2000px;
  text-align: center;
}

/* .backtrack-success-modal h2 {
  font-size: 1em;
  margin-top: 100px;
  margin-bottom: 1rem;
} */
/* .backtrack-success-modal div {
  font-size: 1em;
  margin-top: 100px;
  margin-bottom: 1rem;
} */
.sheet-music {
  width: 100%; /* 너비 조절 */
  min-height: 1000px; /* 높이 조절 */
  background-color: #f0f0f0; /* 배경색 설정 */
  margin-top: 50px;
  padding: 20px;
  font-size: 200px; /* 글자 크기 설정 */
  text-align: center; /* 가운데 정렬 설정 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* 그림자 설정 */
}

.btn-stop,
.btn-success {
  position: relative;
  left: 50%;
  padding: 1em 2.5em;
  font-size: 3.5em;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 700;
  color: #000;
  background-color: #ffffff;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  transform: translateX(-50%);
}
.btn-play {
  position: relative;
  left: 50%;
  padding: 1em 2.5em;
  font-size: 3.5em;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 700;
  color: #000;
  background-color: #8bf29e;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  transform: translateX(-50%);
}

.btn-stop:hover,
.btn-play:hover,
.btn-success:hover {
  background-color: #155724;
  box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
  color: #fff;
  transform: translate(-50%, -7px);
}

.btn-stop:active,
.btn-play:active,
.btn-success:active {
  transform: translate(-50%, -1px);
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

/* .measure {
  font-size: 200px;
}
.next-measure {
  font-size: 100px;
} */
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
</style>
