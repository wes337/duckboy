import {
  onMount,
  createEffect,
  createSignal,
  createMemo,
  Switch,
} from "solid-js";
import { calculateTime } from "../utils";
import state from "../state";
import styles from "./player-content.module.css";

export default function PlayerContent() {
  let audio = new Audio();
  audio.crossOrigin = "anonymous";

  const [currentTime, setCurrentTime] = createSignal("00:00");
  const [currentDuration, setCurrentDuration] = createSignal("00:00");
  const [seekPercentage, setSeekPercentage] = createSignal(0);

  const currentTrack = createMemo(
    () => state.player.tracks[state.player.currentTrack]
  );
  const showAudio = createMemo(() => {
    return currentTrack().type === "audio";
  });

  onMount(() => {
    analyzeAudio();
  });

  createEffect(() => {
    if (!currentTrack()) {
      return;
    }

    if (currentTrack().src !== audio.src) {
      console.log("here");
      setCurrentTime("00:00");
      setCurrentDuration("00:00");
      setSeekPercentage(0);
      audio.src = currentTrack().src;
    } else {
      console.log("HERE!?");
      audio.play();
    }

    audio.onloadedmetadata = () => {
      setCurrentDuration(calculateTime(audio.duration));

      if (state.player.playing) {
        audio.play();
      }
    };

    audio.ontimeupdate = () => {
      const currentTime = Math.floor(audio.currentTime);
      setCurrentTime(calculateTime(currentTime));

      const seek = (audio.currentTime / audio.duration) * 100;
      setSeekPercentage(Math.min(seek.toFixed(0), 99));
    };

    audio.onended = () => {
      state.playerNextTrack();
    };
  });

  createEffect(() => {
    if (state.player.playing) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  createEffect(() => {
    const volume = Number((state.player.volume / 100).toFixed(2));
    audio.volume = volume;
    audio.muted = volume === 0;
  });

  const analyzeAudio = () => {
    let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let audioSource = null;
    let analyser = null;

    audioSource = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let barHeight;

    const animate = () => {
      analyser.getByteFrequencyData(dataArray);
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        // if (!barHeight || barHeight <= 50) {
        //   state.setSpeakerBoom("1");
        // } else if (barHeight > 50 && barHeight <= 100) {
        //   state.setSpeakerBoom("1.05");
        // } else if (barHeight > 150 && barHeight <= 200) {
        //   state.setSpeakerBoom("1.1");
        // } else if (barHeight > 200 && barHeight <= 250) {
        //   state.setSpeakerBoom("1.15");
        // } else if (barHeight > 250) {
        //   state.setSpeakerBoom("1.2");
        // }
      }

      requestAnimationFrame(animate);
    };

    animate();
  };

  return (
    <>
      <div class={styles.playerContent}>
        <Switch
          fallback={
            <video
              class={styles.static}
              src={`/videos/crt-2.mp4`}
              autoplay
              playsinline
              muted
              loop
            />
          }
        >
          <Match when={showAudio()}>
            <div class={styles.audio}>
              <div class={styles.inner}>
                <img
                  class={styles.borderTop}
                  src={`/patterns/gold-border-y.png`}
                />
                <img
                  class={styles.borderBottom}
                  src={`/patterns/gold-border-y.png`}
                />
                <img
                  class={styles.borderLeft}
                  src={`/patterns/gold-border-x.png`}
                />
                <img
                  class={styles.borderRight}
                  src={`/patterns/gold-border-x.png`}
                />
                <div class={styles.cover}>
                  <img src={currentTrack().cover} />
                </div>
                <div class={styles.details}>
                  <div class={styles.artist}>{currentTrack().artist}</div>
                  <div class={styles.name}>
                    <marquee>{currentTrack().name}</marquee>
                  </div>
                  <div class={styles.seek}>
                    <img class={styles.bar} src={`/player/seek-bar.png`} />
                    <img
                      class={styles.knob}
                      src={`/player/seek-knob.png`}
                      style={{ left: `${seekPercentage()}%` }}
                    />
                  </div>
                  <div class={styles.duration}>
                    <div>{currentTime()}</div>/<div>{currentDuration()}</div>
                  </div>
                </div>
              </div>
            </div>
          </Match>
        </Switch>
      </div>
    </>
  );
}
