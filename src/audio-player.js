import { Howl, Howler } from "howler";
import { createStore } from "solid-js/store";
import { CDN_URL, calculateTime } from "./utils";

export default class AudioPlayer {
  static tracks = [
    {
      artist: "DUCKBOY",
      name: "EXCALIBUR",
      cover: `${CDN_URL}/images/album/hymns.jpg`,
      url: `${CDN_URL}/music/EXCALIBUR.mp3`,
    },
    {
      artist: "DUCKBOY",
      name: "my love life needs a lobotomy",
      cover: `${CDN_URL}/images/album/tragic.jpg`,
      url: `${CDN_URL}/music/${encodeURIComponent(
        "my love life needs a lobotomy"
      )}.mp3`,
    },
  ];

  static store = createStore({
    playing: null,
    currentTrackIndex: 0,
    visible: false,
    playingPercentage: 0,
    tracks: AudioPlayer.tracks,
    currentTime: 0,
    duration: 0,
    speakerBoom: "1",
  });

  static animation;

  static init() {
    const [_, setStore] = AudioPlayer.store;

    setStore("tracks", (tracks) =>
      tracks.map((track) => {
        const sound = new Howl({
          src: [track.url],
          ...AudioPlayer.callbacks,
        });

        return {
          ...track,
          sound,
        };
      })
    );

    const analyser = AudioPlayer.analyser;

    const onAnimationFrame = () => {
      const currentSound = AudioPlayer.currentTrack.sound;

      if (currentSound) {
        const seek = currentSound.seek();
        const duration = currentSound.duration();
        setStore("currentTime", seek);
        setStore("duration", duration);
      }

      if (analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        let value = null;

        for (let i = 0; i < bufferLength; i++) {
          const amount = dataArray[i];
          if (amount !== 0 && (value == null || dataArray[i] < value)) {
            value = dataArray[i];
          }
        }

        setStore(
          "speakerBoom",
          value == null ? "1" : (1 + parseInt(value / 4) / 100).toFixed(2)
        );
      }

      AudioPlayer.animation = requestAnimationFrame(onAnimationFrame);
    };

    AudioPlayer.animation = requestAnimationFrame(onAnimationFrame);
  }

  static cleanup() {
    if (AudioPlayer.animation) {
      cancelAnimationFrame(AudioPlayer.animation);
    }

    Howler.stop();
  }

  static get state() {
    const [store] = AudioPlayer.store;
    return store;
  }

  static get playing() {
    const [store] = AudioPlayer.store;
    return store.playing != null;
  }

  static set visible(value) {
    const [_, setStore] = AudioPlayer.store;
    setStore("visible", value);
  }

  static get currentTrack() {
    const [store] = AudioPlayer.store;

    if (store.tracks.length === 0) {
      return null;
    }

    return store.tracks[store.currentTrackIndex];
  }

  static play() {
    if (!AudioPlayer.currentTrack || !AudioPlayer.currentTrack.sound) {
      return;
    }

    AudioPlayer.currentTrack.sound.play();
  }

  static pause() {
    const [store, setStore] = AudioPlayer.store;
    store.tracks.forEach((track) => track.sound.pause());
    setStore("playing", null);
  }

  static next() {
    if (AudioPlayer.currentTrack) {
      AudioPlayer.currentTrack.sound.stop();
    }

    const [store, setStore] = AudioPlayer.store;
    const nextTrackIndex = store.currentTrackIndex + 1;
    const nextTrack = store.tracks[nextTrackIndex];

    setStore("currentTrackIndex", nextTrack ? nextTrackIndex : 0);

    if (!AudioPlayer.playing) {
      AudioPlayer.pause();
    } else {
      AudioPlayer.play();
    }
  }

  static previous() {
    if (AudioPlayer.currentTrack) {
      AudioPlayer.currentTrack.sound.stop();
    }

    const [store, setStore] = AudioPlayer.store;
    const previousTrackIndex = store.currentTrackIndex - 1;
    const previousTrack = store.tracks[previousTrackIndex];

    setStore(
      "currentTrackIndex",
      previousTrack ? previousTrackIndex : store.tracks.length - 1
    );

    if (!AudioPlayer.playing) {
      AudioPlayer.pause();
    } else {
      AudioPlayer.play();
    }
  }

  static get analyser() {
    const analyser = Howler.ctx.createAnalyser();
    analyser.fftSize = 128;
    Howler.masterGain.connect(analyser);

    return analyser;
  }

  static get callbacks() {
    const [store, setStore] = AudioPlayer.store;

    return {
      onseek: (v) => {
        console.log(v);
      },
      onplay: (id) => setStore("playing", id),
      onpause: () => setStore("playing", null),
      onend: (id) => {
        if (store.playing === id) {
          setStore("playing", null);
        }
      },
    };
  }

  static get volume() {
    return Howler.volume();
  }

  static set volume(value) {
    if (value == Howler.volume()) {
      return;
    }

    Howler.volume(parseFloat(value));
  }

  static get seek() {
    try {
      const [store] = AudioPlayer.store;
      const seek = (store.currentTime / store.duration) * 100;
      return Math.min(seek.toFixed(0), 99);
    } catch (error) {
      return 0;
    }
  }

  static get currentTime() {
    try {
      const [store] = AudioPlayer.store;
      return calculateTime(store.currentTime);
    } catch {
      return "00:00";
    }
  }

  static get duration() {
    try {
      const [store] = AudioPlayer.store;
      return calculateTime(store.duration);
    } catch {
      return "00:00";
    }
  }
}
