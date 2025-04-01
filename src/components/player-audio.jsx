import { createMemo } from "solid-js";
import { ALBUMS } from "../constants";
import { randomElementFromArray } from "../utils";
import AudioPlayer from "../audio-player";
import state from "../state";
import styles from "./player-audio.module.css";

export default function PlayerContent() {
  const initialized = () => state.sceneDone("intro");
  const currentTrack = () => AudioPlayer.currentTrack;

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

  const color = () => {
    const album = currentTrack()?.album;

    switch (album) {
      case "tragic":
        return "green";
      case "hymns":
        return "orange";
      case "coping":
        return "blue";
      default:
        return "orange";
    }
  };

  return (
    <div
      classList={{
        [styles.playerAudio]: true,
        [styles[color()]]: true,
        [styles.show]: showAudio(),
      }}
    >
      <div class={styles.bumperBackground}>
        <video src={bumper()} autoplay muted loop playsinline />
      </div>
      <div class={styles.bumper}>
        <video src={bumper()} autoplay muted loop playsinline />
      </div>
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
        <div>{AudioPlayer.currentTime}</div>/<div>{AudioPlayer.duration}</div>
      </div>

      <img class={styles.borderTop} src={`/patterns/gold-border-y.png`} />
      <img class={styles.borderBottom} src={`/patterns/gold-border-y.png`} />
      <img class={styles.borderLeft} src={`/patterns/gold-border-x.png`} />
      <img class={styles.borderRight} src={`/patterns/gold-border-x.png`} />
    </div>
  );
}
