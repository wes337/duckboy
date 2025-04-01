import { createStore } from "solid-js/store";
import { Howl, Howler } from "howler";
import { CDN_URL } from "./constants";
import { calculateTime } from "./utils";

export default class AudioPlayer {
  static tracks = [
    {
      name: "EXCALIBUR",
      album: "hymns",
      url: `${CDN_URL}/music/EXCALIBUR.mp3`,
      bumper: `${CDN_URL}/videos/bumpers/_excalibur.mp4`,
    },
    {
      name: "Heroin As a Recreational Activity",
      album: "hymns",
      url: `${CDN_URL}/music/${encodeURIComponent(
        "Heroin As a Recreational Activity"
      )}.mp3`,
      bumper: `${CDN_URL}/videos/bumpers/_heroin.mp4`,
    },
    {
      name: "Pearls Are Just Oyster Puke",
      album: "hymns",
      url: `${CDN_URL}/music/${encodeURIComponent(
        "Pearls Are Just Oyster Puke"
      )}.mp3`,
      bumper: `${CDN_URL}/videos/bumpers/_pearls.mp4`,
    },
    {
      name: "I Was a Teenage Nihilist",
      album: "hymns",
      url: `${CDN_URL}/music/${encodeURIComponent(
        "I Was a Teenage Nihilist"
      )}.mp3`,
      bumper: `${CDN_URL}/videos/bumpers/_teenage.mp4`,
    },
    {
      name: "XXL Hadron Collider",
      album: "tragic",
      url: `${CDN_URL}/music/${encodeURIComponent("XXL Hadron Collider")}.mp3`,
      bumper: `${CDN_URL}/videos/bumpers/_xxl.mp4`,
    },
    {
      name: "after further reasoning, i'm going to bed",
      album: "tragic",
      url: `${CDN_URL}/music/${encodeURIComponent(
        "after further reasoning, i'm going to bed"
      )}.mp3`,
      bumper: `${CDN_URL}/videos/bumpers/_after.mp4`,
    },
    {
      name: "my love life needs a lobotomy",
      album: "tragic",
      url: `${CDN_URL}/music/${encodeURIComponent(
        "my love life needs a lobotomy"
      )}.mp3`,
      bumper: `${CDN_URL}/videos/bumpers/_lobotomy2.mp4`,
    },
    {
      name: "ROUGAROU (i've become the monster)",
      album: "tragic",
      url: `${CDN_URL}/music/${encodeURIComponent(
        "ROUGAROU (i've become the monster)"
      )}.mp3`,
      bumper: `${CDN_URL}/videos/bumpers/_rougarou.mp4`,
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

  static get currentAlbum() {
    const [store] = AudioPlayer.store;

    if (store.tracks.length === 0) {
      return null;
    }

    return store.tracks[store.currentTrackIndex].album;
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

  static gotoTrack(trackName) {
    if (AudioPlayer.currentTrack) {
      AudioPlayer.currentTrack.sound.stop();
    }

    const [store, setStore] = AudioPlayer.store;
    const trackIndex = store.tracks.findIndex(({ name }) => name === trackName);
    setStore("currentTrackIndex", trackIndex);

    if (!AudioPlayer.playing) {
      AudioPlayer.pause();
    } else {
      AudioPlayer.play();
    }
  }

  static gotoAlbum(album) {
    if (AudioPlayer.currentTrack) {
      AudioPlayer.currentTrack.sound.stop();
    }

    const [store, setStore] = AudioPlayer.store;
    const trackIndex = store.tracks.findIndex((track) => track.album === album);
    setStore("currentTrackIndex", trackIndex);

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
      onplay: (id) => setStore("playing", id),
      onpause: () => setStore("playing", null),
      onend: (id) => {
        if (store.playing !== id) {
          return;
        }

        AudioPlayer.next();
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
