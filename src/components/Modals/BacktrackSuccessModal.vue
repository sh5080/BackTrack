<template>
  <v-dialog
    v-model="$store.state.showBacktrackSuccessModal"
    persistent=""
    @opened="playBacktrack"
  >
    <div class="backtrack-success-modal">
      <div v-if="isLogged">
        <div class="logged-title">
          {{ $store.state.loggedInNickname }} 님의 백킹트랙
        </div>
        <div class="sheet-message" style="top: 180px">
          백킹트랙이 생성되었습니다. <br />만들어진 백킹트랙을 재생 및 저장할 수
          있습니다.
        </div>
      </div>

      <div v-else>
        <div class="sheet-message">
          백킹트랙이 생성되었습니다. <br />만들어진 백킹트랙을 재생할 수
          있습니다.
        </div>
      </div>

      <div class="sheet-music">
        <div v-if="previousChordArray">
          <div class="previous-measure">
            <span
              v-for="(chordSegment, segmentIndex) in previousChordArray
                .join(' ')
                .split(' ')"
              :key="segmentIndex"
              :class="getChordInPreviousMeasure(chordSegment)"
            >
              {{ chordSegment }}
            </span>
          </div>
        </div>

        <div class="measure">
          <span
            v-for="(chordSegment, segmentIndex) in currentChordArray
              .join(' ')
              .split(' ')"
            :key="segmentIndex"
            :class="getChordInMeasure(chordSegment)"
          >
            {{ chordSegment }}
          </span>
        </div>

        <div v-if="nextChordArray">
          <div class="next-measure">
            <span
              v-for="(chordSegment, segmentIndex) in nextChordArray
                .join(' ')
                .split(' ')"
              :key="segmentIndex"
              :class="getChordInNextMeasure(chordSegment)"
            >
              {{ chordSegment }}
            </span>
          </div>
        </div>
      </div>
      <v-row class="option-container">
        <v-col cols="6">
          <v-card class="metronome-container" max-width="1500">
            <v-toolbar
              @click="toggleCard"
              style="height: 150px; width: 1500px; cursor: pointer"
            >
              <v-btn
                style="
                  width: 1420px;
                  height: 150px;
                  margin-top: 80px;
                  right: 10px;
                "
              >
                <span class="metronome-title">메트로놈</span>
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <v-row
                :style="{ height: cardOpen ? '300px' : '0px' }"
                class="mb-4"
                justify="space-between"
              >
                <v-col class="text-left" v-show="cardOpen">
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
                @click="updateBpm"
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
        </v-col>

        <v-col cols="6">
          <v-card>
            <div class="play-container d-flex justify-between align-center">
              <v-switch
                v-model="isDrumOn"
                label="drum"
                color="primary"
                value="primary"
                hide-details
                @click="toggleDrum"
                class="drum-switch"
              ></v-switch>

              <v-btn
                id="playButton"
                @click="playAudio"
                class="me-5 text-none"
                color=""
                variant="text"
                size="x-large"
              >
                <v-icon> mdi-play </v-icon>
              </v-btn>
              <v-btn id="stopButton" class="text-none" variant="text">
                <v-icon> mdi-stop </v-icon>
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <div class="button-container">
        <v-row justify="center">
          <v-dialog v-model="dialog" persistent width="1024">
            <template v-slot:activator="{ props }">
              <v-btn
                v-if="isLogged"
                id="saveButton"
                type="button"
                border
                class="text-none"
                variant="text"
                color="success"
                v-bind="props"
              >
                악보 저장
              </v-btn>
            </template>

            <v-card class="register-container">
              <v-card-title>
                <span style="line-height: normal" class="register-title"
                  >백킹트랙 제목을 입력해 주세요.</span
                >
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="title"
                        style="font-size: 130px; height: 300px"
                        label="제목*"
                        hint="30자 이내로 입력 가능합니다."
                        persistent-hint
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  id="saveButton1"
                  type="button"
                  border
                  class="text-none"
                  variant="text"
                  color="success"
                  @click="saveBacktrack"
                >
                  악보 저장하기
                </v-btn>

                <v-btn
                  id="closeButton1"
                  type="button"
                  @click="dialog = false"
                  border
                  class="text-none"
                  variant="text"
                >
                  닫기
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </div>
      <v-btn
        id="closeButton"
        type="button"
        @click="closeAllModals"
        border
        class="text-none"
        variant="text"
      >
        닫기2
      </v-btn>
    </div>

    <v-sheet
      v-if="isBacktrackSuccess && isLogged"
      elevation="12"
      style="z-index: 999; width: 3000px; height: 2200px"
      rounded="lg"
      class="pa-4 text-center mx-auto"
    >
      <v-icon
        class="mb-5"
        color="success"
        icon="mdi-check-circle"
        size="600"
        style="margin-top: 500px"
      ></v-icon>

      <h2 class="success-title mb-6">백킹트랙 저장에 성공했습니다.</h2>
      <br />
      <div class="success-message mb-4 text-medium-emphasis text-body-2">
        저장된 백킹트랙은 마이페이지에서 확인할 수 있습니다.
      </div>

      <v-divider class="mb-4"></v-divider>

      <div class="text-end">
        <v-btn
          id="mypageButton"
          class="text-none"
          color="success"
          border
          variant="text"
          @click="mypage"
        >
          확인
        </v-btn>
      </div>
    </v-sheet>
  </v-dialog>
</template>

<script>
import * as Tone from "tone";
import * as Toast from "../../plugins/toast";
export default {
  data() {
    return {
      isDrumOn: false,
      isUp: null,
      metronomeSequence: null,
      // drum: new Tone.Player({
      //   url: this.drumSoundUrl,
      //   autostart: false,
      // }).toDestination(),
      transport: Tone.Transport,
      drum: null,
      tableIndex: 0,
      measureIndex: 0,
      chordIndex: 0,
      previousChordArray: null,
      currentChordArray: this.$store.state.chordData[0][0],
      nextChordArray: this.$store.state.chordData[0][1],
      bpm: this.$store.state.bpm,
      isPlaying: false,
      cardOpen: false,
      upSoundUrl: "midi/metronome/up.wav",
      downSoundUrl: "midi/metronome/down.wav",
      drumSoundUrl: "midi/Drummer.wav",
      isSoundPlaying: false,
      isBacktrackSuccess: false,
      dialog: false,
      title: "",
      currentSounds: [],
      prevSound: null,
      chordLists: {
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
        space: "",
      },
    };
  },

  computed: {
    isLogged() {
      return !!this.$store.state.loggedInNickname;
    },
    // bpm() {
    //   return this.bpm;
    // },
    // bpm() {
    //   return this.$store.state.bpm;
    // },
    color() {
      this.$store.commit("setBpm", this.bpm);

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
      this.stopMetronome();
    },
    mypage() {
      this.closeAllModals();
      this.$router.go();
    },
    toggleCard() {
      this.cardOpen = !this.cardOpen;
    },

    updatePreviousChordArray(newChordArray) {
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
      if (this.isPlaying) {
        this.stopMetronome();

        setTimeout(() => {
          this.startMetronome();
        }, 0.001);
      }
    },

    stopMetronome() {
      if (this.metronomeSequence) {
        this.metronomeSequence.clear();
      }
    },
    startMetronome() {
      Tone.start();

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
      Tone.Transport.start();
    },
    startDrum() {
      Tone.start();
      this.drum = new Tone.Player({
        url: this.drumSoundUrl,
        autostart: true,
      }).toDestination();

      Tone.Transport.start();
    },

    // 드럼 중지
    stopDrum() {
      if (this.drum) {
        this.drum.volume.value = -Infinity;
      }
    },
    toggleDrum() {
      this.isDrumOn = !this.isDrumOn;
    },

    stopAudio() {
      if (this.currentSounds.length > 0) {
        this.currentSounds.forEach((sound) => {
          sound.volume.value = -Infinity;
        });
      }

      this.currentSounds = [];
      this.isSoundPlaying = false;
    },
    playSound(soundUrl) {
      console.log("현재 재생된 url: ", soundUrl);
      try {
        const sound = new Tone.Player({
          url: soundUrl,
          autostart: true,
        }).toDestination();

        this.stopAudio();
        this.prevSound = sound;
        this.currentSounds.push(sound);
      } catch (error) {
        console.error(error);
      }
    },
    async playSoundsSequentially(type, input, index = 0) {
      let soundArray;

      if (Array.isArray(input)) {
        soundArray = input;
      } else {
        console.error("잘못된 입력 형식입니다.", input);
        return;
      }

      if (index < soundArray.length) {
        console.log("코드 바뀌는곳");

        if (this.measureIndex !== 0) {
          this.updatePreviousChordArray(
            this.$store.state.chordData[this.tableIndex][this.measureIndex - 1]
          );
        }
        this.updateCurrentChordArray(
          this.$store.state.chordData[this.tableIndex][this.measureIndex]
        );

        if (this.measureIndex === 3 && soundArray.length === 4) {
          if (this.$store.state.chordData[this.tableIndex + 1] !== undefined) {
            this.updateNextChordArray(
              this.$store.state.chordData[this.tableIndex + 1][0]
            );
          } else if (
            this.$store.state.chordData[this.tableIndex + 1] === undefined
          ) {
            this.updateNextChordArray([]);
          }
        } else {
          this.updateNextChordArray(
            this.$store.state.chordData[this.tableIndex][this.measureIndex + 1]
          );
        }

        let chord = soundArray[index];
        if (type === "bass") {
          chord = chord[0];
        }

        if (chord.endsWith("#")) {
          chord = chord.replace("#", "sharp");
        }
        if (chord.endsWith("/")) {
          chord = chord.replace("/", "space");
        }

        console.log(type + ": ", chord);

        if (chord === "space") {
          Tone.Transport.scheduleOnce(() => {
            this.playSoundsSequentially(type, soundArray, index + 1);
          }, `+${60 / this.bpm}`);
        } else {
          const playChord = this.chordLists[chord];
          if (playChord) {
            this.playSound(playChord);

            Tone.Transport.scheduleOnce(() => {
              this.playSoundsSequentially(type, soundArray, index + 1);
            }, `+${60 / this.bpm}`);
          } else {
            console.error(`음원 ${chord}의 URL을 찾을 수 없습니다.`);
          }
        }
      } else {
        if (
          this.measureIndex <
          this.$store.state.chordData[this.tableIndex].length - 1
        ) {
          this.updateCurrentChordArray(
            this.$store.state.chordData[this.tableIndex][this.measureIndex]
          );
          this.measureIndex++;
          console.log("마디 바뀌는곳", this.$store.state.chordData);

          this.updateNextChordArray(
            this.$store.state.chordData[this.tableIndex][this.measureIndex]
          );
          this.playSoundsSequentially(
            "bass",
            this.$store.state.chordData[this.tableIndex][this.measureIndex]
          );
        } else if (this.tableIndex < this.$store.state.chordData.length - 1) {
          this.chordIndex = 0;
          this.measureIndex = 0;
          this.tableIndex++;
          this.updateNextChordArray(
            this.$store.state.chordData[this.tableIndex][this.measureIndex]
          );
          this.updateCurrentChordArray(
            this.$store.state.chordData[this.tableIndex][this.measureIndex]
          );
          console.log("테이블 바뀌는곳");
          this.updatePreviousChordArray(
            this.$store.state.chordData[this.tableIndex - 1][3]
          );

          this.playSoundsSequentially(
            "bass",
            this.$store.state.chordData[this.tableIndex][this.measureIndex]
          );
        } else {
          this.stopAudio();
          this.stopDrum();
          console.log("모든 음원 재생 완료2");
        }
      }
    },

    /** 재생 */
    playAudio() {
      const self = this;

      if (this.isDrumOn) {
        this.stopDrum();
        this.startDrum();
      }
      if (!this.isSoundPlaying) {
        Tone.Transport.stop();
        Tone.Transport.position = 0;
        Tone.start();
        this.tableIndex = 0;
        this.measureIndex = 0;
        this.chordIndex = 0;

        Tone.Transport.bpm.value = this.bpm;

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

                self.playSoundsSequentially("bass", soundArray);

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
            console.log("모든 음원 재생 완료1");
          }
        }

        playNextSound();

        // 정지 버튼 클릭 이벤트 처리
        document.getElementById("stopButton").addEventListener("click", () => {
          this.stopAudio();
          this.stopDrum();

          Tone.Transport.cancel();
          this.tableIndex = 0;
          this.measureIndex = 0;
          this.chordIndex = 0;
          this.isSoundPlaying = false;
          this.transport.stop();
        });
        document.getElementById("closeButton").addEventListener("click", () => {
          this.stopAudio();
          this.stopDrum();

          Tone.Transport.cancel();
          this.tableIndex = 0;
          this.measureIndex = 0;
          this.chordIndex = 0;
          this.isSoundPlaying = false;
          this.transport.stop();
        });
        Tone.Transport.start();
      } else {
        Tone.Transport.stop();
      }
    },

    getChordInMeasure(chordSegment) {
      const classes = [];

      if (
        chordSegment === "A" ||
        chordSegment === "B" ||
        chordSegment === "C" ||
        chordSegment === "D" ||
        chordSegment === "E" ||
        chordSegment === "F" ||
        chordSegment === "G" ||
        chordSegment === "A#" ||
        chordSegment === "B#" ||
        chordSegment === "C#" ||
        chordSegment === "D#" ||
        chordSegment === "E#" ||
        chordSegment === "F#" ||
        chordSegment === "G#" ||
        chordSegment === "Ab" ||
        chordSegment === "Bb" ||
        chordSegment === "Cb" ||
        chordSegment === "Db" ||
        chordSegment === "Eb" ||
        chordSegment === "Fb" ||
        chordSegment === "Gb"
      ) {
        classes.push("key-font");
      } else if (chordSegment === "/") {
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
      } else if (chordSegment === "/") {
        classes.push("small-blank-font");
      } else {
        classes.push("small-extends-font");
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
      } else if (chordSegment === "/") {
        classes.push("small-blank-font");
      } else {
        classes.push("small-extends-font");
      }

      return classes;
    },
    openLoginModal() {
      this.$store.commit("toggleLoginModal", true);
    },
    async saveBacktrack() {
      try {
        if (!this.isLogged) {
          Toast.customError("로그인한 사용자만 저장이 가능합니다.");
          this.openLoginModal();
          return;
        }
        if (this.title.length === 0) {
          Toast.customError("제목을 입력해주세요.");
          return;
        }

        const response = await this.$axios.post(
          "/api/backtrack",
          {
            title: this.title,
            backtrack: this.$store.state.chordData,
            //이후 bpm, 드럼, 피아노 등 추가되는 데이터 추가
          },
          { withCredentials: true }
        );
        if (response.status === 200) {
          this.isBacktrackSuccess = true;
          this.dialog = false;
        }
      } catch (error) {
        console.error("Error generating backtrack:", error);
        if (error.response) {
          if (
            error.response.data.message.includes("필수 입력값이 누락되었습니다")
          ) {
            Toast.customError(
              "악보를 구성해야 저장이 가능합니다. 악보를 확인해 주세요."
            );
          } else {
            Toast.errorMessage(error);
          }
        } else {
          Toast.customWarning("서버 응답을 받을 수 없습니다.");
        }
      }
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
  left: 50%;
  transform: translateX(-50%);
}

.previous-measure {
  /* top: 320px; */
  top: -40px;
  color: rgb(165, 165, 165);
}

.measure {
  top: 50%;
  transform: translate(-50%, -50%);
}

.next-measure {
  /* bottom: 820px; */
  bottom: 10px;
  color: rgb(165, 165, 165);
}

.sheet-music {
  width: 96%;
  height: 1000px;
  background-color: #f0f0f0;
  margin-top: 50px;
  padding: 20px;
  font-size: 200px;
  text-align: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 300px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}
#saveButton1,
#saveButton,
#closeButton,
#closeButton1 {
  position: absolute;
  right: 60px;
  bottom: 640px;
  width: 450px;
  height: 150px;
  font-size: 4em;
}
#playButton,
#stopButton {
  width: 100px;
  height: 100px;
  font-size: 6em;

  background-color: none;
}
#playButton {
  right: 200px;
}
#stopButton {
  right: 100px;
}
#saveButton {
  right: 600px;
}

#saveButton,
#closeButton {
  bottom: 200px;
}
#mypageButton,
#mainButton {
  width: 450px;
  height: 150px;
  margin-top: 400px;
  margin-right: 100px;
  font-size: 4em;
}
#saveButton1 {
  bottom: 100px;
  right: 600px;
}

#closeButton1 {
  bottom: 100px;
  right: 80px;
}
.text-end {
  margin-right: 10px !important;
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
.logged-title {
  position: fixed;
  font-size: 5em;
  top: 70px;
  left: 0;
  right: 0;
  /* bottom: 0; */
}
.sheet-message {
  position: absolute;
  font-size: 3em;
  top: 70px;
  left: 0;
  right: 0;
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

.small-extends-font {
  position: relative;
  font-family: "Font2";
  font-size: 70px;
  bottom: 100px;
  right: 100px;
}

.extends-font {
  position: relative;
  font-family: "Font2";
  font-size: 100px;
  bottom: 200px;
  right: 100px;
}
.blank-font {
  font-family: "Font1";
  font-size: 250px;
  padding: 0px 100px;
  margin-bottom: 50px;
}
.small-blank-font {
  font-family: "Font1";
  font-size: 130px;
  padding: 0px 100px;
  margin-bottom: 30px;
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
:deep(.v-card) {
  /* position: fixed;
  height: 600px;
  bottom: 190px; */
  /* top: 1340px; */
}
:deep(.v-card .v-card-text) {
  line-height: 300px;
  margin-top: -40px;
  padding: 50px;
}
:deep(.v-card .v-card-title) {
  line-height: none !important;
}
:deep(.v-toolbar-title__placeholder) {
  height: 100px;
  font-size: 200px;
  align-items: center;
}
:deep(.v-btn--icon.v-btn--density-default) {
  width: 100px;
  height: 100px;
  font-size: 50px;
}

:deep(.v-toolbar__content) {
  position: fixed;
  max-width: 1500px;
}

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
.register-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2500px;
  height: 1000px;
}
.register-title {
  font-size: 80px;

  position: absolute;
  padding: 100px 100px;
}
.success-title {
  font-size: 6rem !important;
  font-weight: 400;
  line-height: 5rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
  text-transform: none !important;
}
.success-message {
  font-size: 4rem !important;
  font-weight: 400;
  line-height: 3rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
  text-transform: none !important;
}
:deep(.v-text-field input.v-field__input) {
  font-size: 70px;
}
:deep(
    .v-input--density-default
      .v-field--variant-filled
      .v-label.v-field-label--floating,
    .v-label.v-field-label
  ) {
  font-size: 40px;
}
:deep(.v-messages) {
  font-size: 60px;
  top: 40px;
}

:deep(.v-label) {
  font-size: 70px;
}
:deep(.v-input__details) {
  overflow: visible;
}
:deep(.v-text-field .v-field) {
  margin-top: 300px;
}
.option-container {
  display: flex;
  position: relative;
  top: 1340px;
}
.play-container {
  padding: 50px;
}
:deep(.v-switch__track) {
  width: 170px;
  height: 60px;
}
:deep(.v-switch__thumb) {
  width: 60px;
  height: 60px;
}
:deep(.v-selection-control--density-default) {
  --v-selection-control-size: none;
}
.v-switch .drum-switch::before {
  left: 100px;
}
.v-switch .drum-switch::after {
  right: 100px;
}
</style>
