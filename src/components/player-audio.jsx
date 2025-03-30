import { createSignal, createMemo, createEffect, onCleanup } from "solid-js";
import { ALBUMS } from "../constants";
import { randomElementFromArray } from "../utils";
import AudioPlayer from "../audio-player";
import state from "../state";
import styles from "./player-audio.module.css";

export default function PlayerContent() {
  const initialized = () => state.sceneDone("intro");
  const currentTrack = () => AudioPlayer.currentTrack;
  const [showBumper, setShowBumper] = createSignal(false);

  const showAudio = createMemo(() => {
    return initialized() && state.showContent() === "audio";
  });

  const bumper = createMemo(() => {
    if (!currentTrack()) {
      return null;
    }

    if (currentTrack().bumper) {
      return currentTrack().bumper;
    }

    const bumpers = ALBUMS[currentTrack().album]?.bumpers || [];

    if (bumpers.length === 0) {
      return null;
    }

    return randomElementFromArray(bumpers);
  });

  createEffect(() => {
    if (!bumper()) {
      return;
    }

    setShowBumper(true);

    const interval = setInterval(() => {
      setShowBumper((showBumper) => !showBumper);
    }, 10000);

    onCleanup(() => {
      clearInterval(interval);
    });
  });

  return (
    <div classList={{ [styles.playerAudio]: true, [styles.show]: showAudio() }}>
      <div class={styles.inner}>
        {bumper() && (
          <div class={styles.bumperBackground}>
            <video src={bumper()} autoplay muted loop playsinline />
          </div>
        )}
        <img class={styles.borderTop} src={`/patterns/gold-border-y.png`} />
        <img class={styles.borderBottom} src={`/patterns/gold-border-y.png`} />
        <img class={styles.borderLeft} src={`/patterns/gold-border-x.png`} />
        <img class={styles.borderRight} src={`/patterns/gold-border-x.png`} />
        <div class={styles.cover}>
          <img src={ALBUMS[currentTrack().album].cover} />
          {bumper() && (
            <video
              classList={{ [styles.bumper]: true, [styles.show]: showBumper() }}
              src={bumper()}
              autoplay
              muted
              loop
              playsinline
            />
          )}
        </div>
        <div class={styles.details}>
          <div class={styles.artist}>DUCKBOY</div>
          <div class={styles.name}>
            <marquee>{currentTrack().name}</marquee>
          </div>
          <div class={styles.seek}>
            <img class={styles.bar} src={`/player/seek-bar.png`} />
            <img
              class={styles.knob}
              src={`/player/seek-knob.png`}
              style={{ left: `${AudioPlayer.seek}%` }}
            />
          </div>
          <div class={styles.duration}>
            <div>{AudioPlayer.currentTime}</div>/
            <div>{AudioPlayer.duration}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
