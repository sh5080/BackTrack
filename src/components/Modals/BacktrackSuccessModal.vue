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
                    :class="getChordPieceClasses(piece)"
                  >
                    {{ piece }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <button @click="playBacktrack">악보 재생</button> -->
      <button @click="playAudio" class="btn-play" style="font-size: 3.5em">
        음원 재생
      </button>
      <button @click="stopAllAudio" class="btn-stop" style="font-size: 3.5em">
        음원 정지
      </button>
      <button
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
import { Piano } from "@tonejs/piano";
export default {
  data() {
    return {
      abcContent: "",
      audioElements: [],
      metronomeInterval: null,
      isDrum: null,
      isUp: null,
    };
  },
  computed: {
    isLogged() {
      return !!this.$store.state.loggedInNickname;
    },
    backtrackModalData() {
      return this.$store.state.backtrackModalData;
    },
    bpm() {
      return this.$store.state.bpm;
    },
  },
  created() {
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = "4m";
  },
  // mounted() {

  // },
  methods: {
    closeAllModals() {
      this.$store.commit("toggleBacktrackSuccessModal", false);
    },
    /** 재생 */
    playAudio() {
      const chords = ["C4", "E4", "G4"];
      const duration = ["4n", "4n", "4n"];
      const tempo = this.$store.state.bpm;
      Tone.Transport.bpm.value = tempo;

      // 반복 재생 설정
      Tone.Transport.loop = true;
      Tone.Transport.loopStart = 0;
      // Tone.Transport.loopEnd = "4m";

      // 메트로놈 관련
      const upSoundUrl = "midi/up.wav";
      const downSoundUrl = "midi/down.wav";
      const drumSoundUrl = "midi/Drummer.wav";
      const metronome = new Tone.Sequence(
        (time, note) => {
          // "up" 또는 "down" 사운드 재생
          if (note === "up" && !this.isUp) {
            playSound(upSoundUrl);
            this.isUp = true;
          } else if (note === "down") {
            this.isUp = false;
            playSound(downSoundUrl);
          }
        },
        ["up", "down", "down", "down"],
        "4n"
      );
      const drum = new Tone.Sequence(
        (time, note) => {
          if (note === "drum" && !this.isDrum) {
            playSound(drumSoundUrl);
            this.isDrum = true;
          }
        },
        ["drum"],
        "1n"
      );
      function playSound(soundUrl) {
        const sound = new Tone.Player({
          url: soundUrl,
          autostart: true,
          console: console.log("here!: ", soundUrl),
        }).toDestination();
      }
      // drum.start();
      Tone.start().then(() => {
        setTimeout(() => {
          metronome.start();
        }, 100);
        drum.start();
      });
      this.audioElements.push(drum);

      // 메트로놈 시작
      Tone.Transport.start();
    },

    stopAllAudio() {
      // 모든 음원을 정지
      if (this.metronome) {
        this.metronome.stop();
        this.metronome.dispose();
      }
      this.audioElements.forEach((audioElement) => {
        audioElement.pause();
        audioElement.currentTime = 0;
      });
      Tone.stop();
      Tone.Transport.stop();

      // 배열 비우기
      this.audioElements = [];
    },

    // fetchMidi() {
    //   // MIDI 파일의 URL
    //   const midiFileURL = "midi/Drummer.wav";

    //   // MIDI 파일 데이터 가져오기
    //   fetch(midiFileURL)
    //     .then((response) => response.arrayBuffer())
    //     .then((data) => {
    //       const midiFileData = new Uint8Array(data);
    //       this.playMidiFile(midiFileData);
    //     })
    //     .catch((error) => {
    //       console.error("Error loading MIDI file:", error);
    //     });
    // },

    // async playMidiFile(midiFileData) {
    //   try {
    //     const midiAccess = await navigator.requestMIDIAccess();
    //     // MIDI 출력 장치 선택
    //     const outputs = midiAccess.outputs.values();
    //     let output = outputs.next().value;

    //     // MIDI 파일 재생
    //     output.send(midiFileData);
    //   } catch (error) {
    //     console.error("MIDI 오류:", error);
    //   }
    // },

    async sheetMusic() {
      try {
      } catch (error) {
        console.error("Error to create Backtrack in:", error);
      }
    },

    getChordPieceClasses(chordSegment) {
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
.backtrack-success-modal div {
  font-size: 1em;
  margin-top: 100px;
  margin-bottom: 1rem;
}
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

.measure {
  font-size: 100px;
}
.key-font {
  font-family: "Font1";
  font-size: 150px;
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
