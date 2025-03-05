import {
  onMount,
  onCleanup,
  createEffect,
  createSignal,
  createMemo,
  Switch,
} from "solid-js";
import { calculateTime, isMacOS } from "../utils";
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
    const introFinished = state.sceneDone("intro");
    return introFinished && currentTrack().type === "audio";
  });

  onMount(() => {
    if (isMacOS()) {
      return;
    }

    let interval;

    const analyzeAudio = () => {
      let audioCtx = new AudioContext();
      let audioSource = null;
      let analyser = null;

      audioSource = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      audioSource.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.fftSize = 128;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      interval = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);

        let value = null;

        for (let i = 0; i < bufferLength; i++) {
          const amount = dataArray[i];

          if (amount !== 0 && (value == null || dataArray[i] < value)) {
            value = dataArray[i];
          }
        }

        if (value == null) {
          state.setSpeakerBoom("1");
        } else {
          value = value / 4;
          state.setSpeakerBoom((1 + parseInt(value) / 100).toFixed(2));
        }
      }, 50);
    };

    analyzeAudio();

    onCleanup(() => {
      if (interval) {
        clearInterval(interval);
      }
    });
  });

  createEffect(() => {
    if (!currentTrack()) {
      return;
    }

    if (currentTrack().src !== audio.src) {
      setCurrentTime("00:00");
      setCurrentDuration("00:00");
      setSeekPercentage(0);
      audio.src = currentTrack().src;
    } else {
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

  return (
    <>
      <div class={styles.playerContent}>
        <video
          classList={{ [styles.static]: true, [styles.on]: !showAudio() }}
          src={`/videos/crt-2.mp4`}
          autoplay
          playsinline
          muted
          loop
        />
        <Switch
          fallback={
            <video
              class={styles.static}
              src={`/videos/crt.mp4`}
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
